import React from 'react';
import {FlatList, Modal,TextInput,Platform,TouchableWithoutFeedback,View,ListView,Text,Image,Dimensions,ImageBackground,Animated,Easing,RefreshControl,DeviceEventEmitter} from 'react-native';
import { connect } from 'react-redux';
import {Dialog,Toast,Button} from '../../comps'
import {Colors,Images,NavUtils,Emiter,Common} from '../../utils'
import Globle from  '../../utils/Globle'
import I18n from '../../language/Ii8n'
import { DataPicker } from 'rnkit-actionsheet-picker';
import moment from 'moment';
import NetImg from '../../utils/NetImg';
require('moment/locale/zh-cn');
const screen = Dimensions.get('window');
var page=1;
const cardH =  (screen.width-10)/1.8;
const topH = screen.height==812?83:65;
/**
 * WalletContainer create by espritblock 
 */
@connect(({ wallet }) => ({ ...wallet}))
class WalletContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      wh:(screen.width-10)/1.8,
      fadeOpacity: new Animated.Value(0),
      visible:false,
      kcode:"",
      purseCoin:{}
    };
  }

  static navigationOptions = {
    header:null,
    title:I18n.t("tab.1")
  };

  /**
   * 初始化
   */
  componentDidMount() {
    if(!Globle.purseCoins || Globle.purseCoins.length==0){
      this.props.dispatch({type:'wallet/coins',payload:{},callback:()=>{
        let purseCoin = Globle.purseCoins && Globle.purseCoins.length>0?Globle.purseCoins[0]:null;
        this.loadCoin(purseCoin);
      }});
    }else{
      let purseCoin = Globle.purseCoins && Globle.purseCoins.length>0?Globle.purseCoins[0]:null;
      this.loadCoin(purseCoin);
    }
    DeviceEventEmitter.emit("initDrawer");
    DeviceEventEmitter.addListener(Emiter.im_transfer, (e) => {
      page = 1;
      this.loadTrans(this.state.purseCoin,1,false);
      this.props.dispatch({type:'wallet/balance',payload:{account:Globle.wallet.name,pcid:this.state.purseCoin.id}});
    });
  }

  /**
   * 刷新数据
   */
  loadCoin = (c) =>{
    page = 1;
    Globle.currentCoin = c;
    this.setState({purseCoin:c});
    this.props.dispatch({type:'wallet/balance',payload:{account:Globle.wallet.name,pcid:c.id}});
    this.loadTrans(c,1,false);
  }

  /**
   * 切换币种
   */
  chooseCoin = () =>{
    let arr = new Array();
    Globle.purseCoins.map((item)=>{
        arr.push(item.name);
    })
    DataPicker.show({
        dataSource: arr,
        numberOfComponents: 1,
        onPickerConfirm: (selectedData, selectedIndex) => {
          this.setState({purseCoin:Globle.purseCoins[selectedIndex]});
          this.loadCoin(Globle.purseCoins[selectedIndex]);
        },
        onPickerCancel: () => {},
        onPickerDidSelect: (selectedData, selectedIndex) => {}
    });
  }

  /**
   * 加载交易记录
   */
  loadTrans = (c,page,load) =>{
    this.props.dispatch({type:'wallet/trans',payload:{load,pcid:c.id,page}});
  }

  /**
   * 加载更多
   */
  loadMore = () =>{
    if(!this.scroll){return}
    page = page+1;
    this.loadTrans(this.state.purseCoin,page,false);
  }

  /**
   * 扫描
   */
  scan = () =>{
   this.setState({visible:true});
  }

  /**
   * 打开个人中心
   */
  open = () =>{
    NavUtils.openDrawer("left");
  }

  /**
   * action
   */
  action = (action) =>{
    if(action==1){
      NavUtils.navigation("CoinDesc",{coin:this.state.purseCoin.code});
    }else if(action==2){
      NavUtils.navigation("ReceivableCode",{});
    }else if(action==3){
      NavUtils.navigation("Transfer",{});
    }
  }

  /**
   * 刷新
   */
  refresh = () =>{
    page = 1;
    this.loadTrans(this.state.purseCoin,1,true);
    this.props.dispatch({type:'wallet/balance',payload:{account:Globle.wallet.name,pcid:this.state.purseCoin.id}});
  }

  /**
   * 菜单点击
   */
  menuClick = (action) =>{
    this.setState({visible:false});
    if(action==0){
      NavUtils.navigation("RequestList",{});
    }else if(action==1){
      NavUtils.navigation("RequestList",{});
    }else if(action==2){
      NavUtils.navigation("Card",{});
    }else if(action==3){
      NavUtils.navigation("Transfer",{});
    }else if(action==4){
      NavUtils.navigation("ReceivableCode",{});
    }else if(action==5){
      NavUtils.navigation("QrScan",{});
    }
  }

  /**
   * 用户详情
   */
  toUser = (item) =>{
    if(item.uid){
      NavUtils.navigation("UserSpace",{uid:item.uid});
    }
  }

  render() {
    const { datas } = this.props;
    return <View background="#fff">
      <ImageBackground style={{backgroundColor:Colors.mainColor,position:"absolute",top:0,left:0,width:"100%",height:Common.scaleSize(300)}}>
      </ImageBackground>
      <Animated.View style={{zIndex:999,position:"absolute",top:0,left:0,width:'100%',opacity: this.state.fadeOpacity}}>
        <ImageBackground source={Images.wallet_top} style={{height:topH+10,width:'100%',flexDirection:"row",backgroundColor:Colors.mainColor,justifyContent:"space-between",paddingTop:screen.height==812?38:20}}>
          <Button onPress={()=>{this.open()}}>
            <View>
              <Image source={Images.my} style={{width:Common.scaleSize(18),height:Common.scaleSize(18),margin:20}} />
            </View>
          </Button>
          <Text style={{color:'rgba(255,255,255,0.7)',fontSize:Common.scaleSize(16),marginTop:Platform.OS=="ios"?Common.scaleSize(20):Common.scaleSize(15)}}>{I18n.t("tab1.wallet")}</Text>
          <Button onPress={()=>{this.scan()}}>
            <View>
              <Image resizeMode="contain" source={Images.more_w} style={{height:Common.scaleSize(17),margin:20}} />
            </View>
          </Button>
        </ImageBackground>
      </Animated.View>
      
      <FlatList
        onScroll={(event)=>{
            this.scroll=true;
            if(event.nativeEvent.contentOffset.y>80){
              if(this.state.fadeOpacity>0){
                return;
              }
              Animated.timing(this.state.fadeOpacity, {
                  toValue: 1,
                  duration: 300,
                  easing: Easing.linear,// 线性的渐变函数
              }).start();
            }else{
              if(this.state.fadeOpacity>=1){
                return;
              }
              Animated.timing(this.state.fadeOpacity, {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,// 线性的渐变函数
              }).start();
            }
          }
        }
        keyExtractor={(item, index) => item.time+item.from+item.to}
        onEndReached={() => this.loadMore()}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={this.props.transloading}
            onRefresh={() => this.refresh()}
            tintColor={Colors.mainColor}
            colors={['#ddd']}
            progressBackgroundColor="#ffffff"
          />
        }
        initialListSize={10}
        ItemSeparatorComponent={() => <View><View style={{marginLeft:Common.scaleSize(73),height:0.7,backgroundColor:'#efefef'}} /></View>}
        style={{backgroundColor:"#fff",height:"100%"}}
        enableEmptySections={true}
        data={datas}
        ListHeaderComponent={()=>(<View style={{flex:1,backgroundColor:'#fff'}}>
              <View style={{flexDirection:"column",height:topH+cardH}}>
              <ImageBackground source={Images.wallet_top} style={{height:topH+cardH/2,width:'100%',flexDirection:"row",justifyContent:"space-between",paddingTop:screen.height==812?38:20}}>
                  <Button onPress={()=>{this.open()}}>
                    <View>
                      <Image source={Images.my} style={{width:Common.scaleSize(18),height:Common.scaleSize(18),margin:20}} />
                    </View>
                  </Button>
                  <Text style={{color:'rgba(255,255,255,0.7)',fontSize:Common.scaleSize(16),marginTop:Platform.OS=="ios"?Common.scaleSize(20):Common.scaleSize(15)}}>{I18n.t("tab1.wallet")}</Text>
                  <Button onPress={()=>{this.scan()}}>
                    <View>
                      <Image  resizeMode="contain" source={Images.more_w} style={{height:Common.scaleSize(17),margin:20}} />
                    </View>
                  </Button> 
                </ImageBackground>
                <ImageBackground source={Images.bg} resizeMode='cover' style={{flexDirection:'column',borderRadius:8,padding:Common.scaleSize(25),paddingTop:Common.scaleSize(30),paddingBottom:Common.scaleSize(26),zIndex:999,position:'absolute',top:topH,left:5,width:screen.width-10,height:cardH}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',height:'33%'}}>
                    <View style={{flexDirection:'row',alignSelf:"flex-start"}}>
                      <Image resizeMode='contain' source={this.state.purseCoin && this.state.purseCoin.img?{uri:this.state.purseCoin.img}:null} style={{width:Common.scaleSize(24),height:Common.scaleSize(24)}}/>
                      <Text style={{alignSelf:'center',marginLeft:Common.scaleSize(10),color:'rgba(33,44,104,0.30)',fontSize:Common.scaleSize(12)}}>{this.state.purseCoin.name}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                      <Button onPress={()=>{
                          this.chooseCoin();
                      }}>
                        <Text style={{color:'#252d36',fontSize:Common.scaleSize(11.5)}}>切换币种</Text>
                      </Button>
                    </View>
                    
                  </View>
                  <View style={{justifyContent:"center",height:'33%'}}>
                    <Text style={{color:'#212c68',fontSize:Common.scaleSize(14),marginTop:Common.scaleSize(10)}}>总资产 ({this.state.purseCoin.name})</Text>
                    <Text style={{color:'#212c68',fontSize:Common.scaleSize(32),fontWeight:"bold",marginLeft:Common.scaleSize(5),marginTop:Common.scaleSize(10)}}>{this.props.balance}</Text>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between',height:'33%'}}>
                      <Button style={{justifyContent:"flex-end",}}>
                        <Text style={{color:'#252d36',fontSize:Common.scaleSize(14)}}>{Globle.wallet.name}</Text>
                      </Button>
                      <Button style={{justifyContent:"flex-end",}} onPress={()=>{
                          NavUtils.navigation("Backup",{isCreat:false});
                      }}>
                        <Text style={{color:'#252d36',fontSize:Common.scaleSize(11.5)}}>备份账户</Text>
                      </Button>
                  </View>
                  
                </ImageBackground>
              </View>
              <View style={{flexDirection:"row"}}>
               
                <Button onPress={()=>{this.action(2)}} style={{width:'33%',justifyContent:'center'}}>
                  <View style={{alignSelf:'center',width:'100%',paddingTop:0,padding:Common.scaleSize(10)}}>
                    <Image source={Images.money} style={{width:Common.scaleSize(50),height:Common.scaleSize(50),alignSelf:'center',margin:Common.scaleSize(5)}} />
                    <Text style={{color:"#666666",fontSize:Common.scaleSize(11),textAlign:'center'}}>{I18n.t("tab1.getmoney")}</Text>
                  </View>
                </Button>
                <Button onPress={()=>{this.action(3)}} style={{width:'33%'}}>
                  <View style={{alignSelf:'center',width:'100%',paddingTop:0,padding:Common.scaleSize(10)}}>
                    <Image source={Images.trans} style={{width:Common.scaleSize(50),height:Common.scaleSize(50),alignSelf:'center',margin:Common.scaleSize(5)}} />
                    <Text style={{color:"#666666",fontSize:Common.scaleSize(11),textAlign:'center'}}>{I18n.t("tab1.paymoney")}</Text>
                  </View>
                </Button>
                <Button onPress={()=>{this.action(1)}} style={{width:'33%',justifyContent:'center'}}>
                  <View style={{alignSelf:'center',width:'100%',paddingTop:0,padding:Common.scaleSize(10)}}>
                    <Image source={Images.forward} style={{width:Common.scaleSize(50),height:Common.scaleSize(50),alignSelf:'center',margin:Common.scaleSize(5)}} />
                    <Text style={{color:"#666666",fontSize:Common.scaleSize(11),textAlign:'center'}}>资料</Text>
                  </View>
                </Button>
              </View>
              <View style={{justifyContent:'center',backgroundColor:Colors.background,height:Common.scaleSize(40)}}>
                <Text style={{color:'#666666',fontSize:Common.scaleSize(12),marginLeft:Common.scaleSize(20)}}>{I18n.t("tab1.payinfo")}</Text>
              </View>
            </View>)
        }
        renderItem={({item}) => (
          <Button onPress={()=>NavUtils.navigation("TxInfo",{txid:item.tid})}>
            <View style={{backgroundColor:'#fff',flexDirection:'row',padding:Common.scaleSize(5),justifyContent:"space-between"}}> 
              <View style={{flexDirection:'row',maxWidth:screen.width-Common.scaleSize(80)}}>   
                <Button onPress={()=>this.toUser(item)}>
                  <Image source={item.photo?{uri:NetImg.small(item.photo)}:Images.head} style={{width:Common.scaleSize(45),height:Common.scaleSize(45),margin:Common.scaleSize(10),borderRadius:Common.scaleSize(22.5)}} />
                </Button>
                <View style={{flexDirection:'column',alignSelf:'center',marginLeft:Common.scaleSize(5)}}>
                  <Text numberOfLines={1} style={{maxWidth:Common.scaleSize(100),marginTop:Common.scaleSize(10),color:'#000',fontSize:Common.scaleSize(15)}}>{item.name}</Text>
                  <Text numberOfLines={1} style={{marginTop:Common.scaleSize(10),color:'#666666',fontSize:Common.scaleSize(12)}}>[{item.type}] {item.memo}</Text>
                  <Text style={{color:'#9b9b9b',fontSize:Common.scaleSize(11),marginTop:Common.scaleSize(10),marginBottom:Common.scaleSize(5)}}>{moment(item.time).fromNow()}</Text>
                </View>
              </View>
              <Text style={{position:"absolute",left:0,top:Common.scaleSize(13),width:screen.width-10,color:item.in?"#F08080":"#000",fontSize:Common.scaleSize(15),textAlign:'right'}}>{item.in?"+"+item.qua:"-"+item.qua} {item.coin}</Text>
            </View>
          </Button>
        )}
      />


      <Modal
          animationType={'none'}
          transparent
          hardwareAccelerated
          visible={this.state.visible}
          onRequestClose={()=>{this.setState({visible:false})}}
          supportedOrientations={['portrait', 'landscape']}>
          <TouchableWithoutFeedback onPress={()=>this.setState({visible:false})}>
            <View style={{width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.0)"}}>
              <View style={{flexDirection:"column",backgroundColor:'#fff',top:(Platform.OS=="ios"?(screen.height==812)?Common.scaleSize(92):Common.scaleSize(74):Common.scaleSize(49)),left:screen.width-Common.scaleSize(145),borderRadius:2,elevation:24,shadowColor:"rgba(0,0,0,0.3)",shadowOffset:{width:1,height:1},shadowOpacity:0.6,shadowRadius:3,position:'absolute',width:Common.scaleSize(140),}}>
                  <Button onPress={()=>this.menuClick(0)}>
                    <View style={{flex:1,flexDirection:"row",height:Common.scaleSize(45)}}>
                      <Image resizeMode="contain" source={Images.icon_add} style={{alignSelf:"center",marginLeft:Common.scaleSize(15),marginRight:Common.scaleSize(13),width:Common.scaleSize(16)}}/>
                      <Text style={{alignSelf:"center",color:"#4a4a4a",fontSize:Common.scaleSize(14)}}>添加好友</Text>
                    </View>
                  </Button>
                  <View style={{width:"100%",height:0.5,backgroundColor:"#999999",opacity:0.13}}></View>
                  
                  <Button onPress={()=>this.menuClick(2)}>
                    <View style={{flex:1,flexDirection:"row",height:Common.scaleSize(45)}}>
                      <Image resizeMode="contain" source={Images.icon_card} style={{alignSelf:"center",marginLeft:Common.scaleSize(16),marginRight:Common.scaleSize(12),width:Common.scaleSize(16)}}/>
                      <Text style={{alignSelf:"center",color:"#4a4a4a",fontSize:Common.scaleSize(14)}}>我的名片</Text>
                    </View>
                  </Button>
                  <View style={{width:"100%",height:0.5,backgroundColor:"#999999",opacity:0.13}}></View>
                  <Button onPress={()=>this.menuClick(3)}>
                    <View style={{flex:1,flexDirection:"row",height:Common.scaleSize(45)}}>
                      <Image resizeMode="contain" source={Images.icon_trans} style={{alignSelf:"center",marginLeft:Common.scaleSize(15),marginRight:Common.scaleSize(14),width:Common.scaleSize(16)}}/>
                      <Text style={{alignSelf:"center",color:"#4a4a4a",fontSize:Common.scaleSize(14)}}>转账</Text>
                    </View>
                  </Button>
                  <View style={{width:"100%",height:0.5,backgroundColor:"#999999",opacity:0.13}}></View>
                  <Button onPress={()=>this.menuClick(4)}>
                    <View style={{flex:1,flexDirection:"row",height:Common.scaleSize(45)}}>
                      <Image resizeMode="contain" source={Images.icon_recive} style={{alignSelf:"center",marginLeft:Common.scaleSize(15),marginRight:Common.scaleSize(13.5),width:Common.scaleSize(16)}}/>
                      <Text style={{alignSelf:"center",color:"#4a4a4a",fontSize:Common.scaleSize(14)}}>收款</Text>
                    </View>
                  </Button>
                  <View style={{width:"100%",height:0.5,backgroundColor:"#999999",opacity:0.13}}></View>
                  <Button onPress={()=>this.menuClick(5)}>
                    <View style={{flex:1,flexDirection:"row",height:Common.scaleSize(45)}}>
                      <Image resizeMode="contain" source={Images.icon_scan} style={{alignSelf:"center",marginLeft:Common.scaleSize(15),marginRight:Common.scaleSize(13),width:Common.scaleSize(16)}}/>
                      <Text style={{alignSelf:"center",color:"#4a4a4a",fontSize:Common.scaleSize(14)}}>扫一扫</Text>
                    </View>
                  </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
    </View>;
  }

}

export default WalletContainer;
