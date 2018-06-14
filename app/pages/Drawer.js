import React, { Component} from 'react'
import {TouchableWithoutFeedback,Dimensions,ScrollView,View,Text,ImageBackground,DeviceEventEmitter,Image,findNodeHandle} from 'react-native'
import Drawer from 'react-native-drawer'
import Globle from '../utils/Globle'
import {Colors,Images,NavUtils,NetImg,Common} from '../utils'
import {BlurView} from 'react-native-blur';
import {Button} from '../comps'
var screen = Dimensions.get('window');

/**
 * MyDrawer create by espritblock 
 */
export default class MyDrawer extends Component {
  
  state = {
    login:{},
    viewRef: null ,
    side:"left"
  }

  constructor(props){
    super(props)
  }

  componentDidMount(){
    DeviceEventEmitter.addListener("initDrawer",(side) => {
      this.setState({login:Globle.login});
    });
    NavUtils.initDrawer(this._drawer);
  }

  imageLoaded() {
    this.setState({viewRef:findNodeHandle(this.backgroundImage)});
  }

  action = (action) => {
    this._drawer.close();
    setTimeout(() => {
      if(action=="info"){
        NavUtils.navigation("My",{});
      }else if(action=="idcard"){
        NavUtils.navigation("Auth",{});
      }else if(action=="feedback"){
        NavUtils.navigation("Feedback",{});
      }else if(action=="about"){
        NavUtils.navigation("About",{});
      }else if(action=="help"){
        NavUtils.navigation("Web",{title:"帮助","url":"http://www.baidu.com"});
      }else if(action=="setting"){
        NavUtils.navigation("Setting",{});
      }else if(action=="invite"){
        NavUtils.navigation("Invitation",{});
      }
    },300);
  }

  render(){
    return(<Drawer
            type="overlay"
            tapToClose={true}
            openDrawerOffset={0}
            panCloseMask={0.3}
            closedDrawerOffset={0}
            side={this.state.side}
            ref={(ref) => this._drawer = ref}
            tweenHandler={(ratio) => ({
              mainOverlay: { backgroundColor:'rgba(0,0,0,'+(ratio>0.5?0.5:ratio)+')' }
            })}
            
            content={
              <TouchableWithoutFeedback onPress={()=>this._drawer.close()}>
                <ScrollView bounces={false} showsVerticalScrollIndicator={false} backgroundColor="rgba(0,0,0,0)">
                <View style={{height:screen.height,width:screen.width*0.65,backgroundColor:'#fff'}}>
                  <ImageBackground source={Images.wallet_top} style={{height:Common.scaleSize(280),backgroundColor:Colors.mainColor}}>
                    
                    <Image
                      ref={(img) => { this.backgroundImage = img; }}
                      resizeMode="cover"
                      style={{zIndex:0,width:'100%',position: "absolute",height:"100%"}}
                      onLoadEnd={this.imageLoaded.bind(this)}
                      source={this.state.login.photo?{uri:NetImg.big(this.state.login.photo)}:Images.head}/>

                    <BlurView
                        style={{zIndex:0,width:'100%',height:"100%",position: "absolute",padding:0,margin:0,borderWidth:0}}
                        viewRef={this.state.viewRef==null?null:this.state.viewRef}
                        blurType="light"
                        blurAmount={15}/>
                        
                      <View
                       style={{backgroundColor:Colors.mainColor,opacity:0.82,width:'100%',height:"100%",position: "absolute",padding:0,margin:0,borderWidth:0}}
                      >
                        
                      </View>
                    
                    <View style={{flexDirection:"column",height:"100%",justifyContent:"center",alignSelf:"center"}}>
                        <Image
                          resizeMode="cover"
                          style={{width:Common.scaleSize(70),height:Common.scaleSize(70),borderRadius:Common.scaleSize(35),marginTop:Common.scaleSize(30),marginBottom:Common.scaleSize(3),alignSelf:"center"}}
                          source={this.state.login.photo?{uri:NetImg.small(this.state.login.photo)}:Images.head}
                          />
                        <View style={{flexDirection:"row",justifyContent:"center",paddingTop:Common.scaleSize(15)}}>
                          <Text style={{fontSize:Common.scaleSize(15),color:'#fff'}}>{this.state.login.nickname}</Text><Image style={{alignSelf:"center",marginLeft:Common.scaleSize(5),width:Common.scaleSize(13),height:Common.scaleSize(13)}} source={this.state.login.sex==0?Images.sex0:Images.sex1} />
                        </View>
                        <Text style={{fontSize:Common.scaleSize(14),color:'#fff',marginTop:Common.scaleSize(5),lineHeight:Common.scaleSize(26),textAlign:'center'}}>{this.state.login.username}</Text>
                        <Text style={{fontSize:Common.scaleSize(12),color:'#fff',lineHeight:Common.scaleSize(26),paddingTop:0,padding:Common.scaleSize(10),width:'100%',textAlign:'center'}}>{this.state.login.sign?this.state.login.sign:'这家伙很懒，没有个性签名'}</Text>
                    </View>
                    
                  </ImageBackground>
                  <View style={{marginTop:Common.scaleSize(50),marginBottom:Common.scaleSize(50),flexDirection:'column'}}>
                      <Button onPress={()=>{this.action('info')}}>
                        <View style={{paddingLeft:Common.scaleSize(40),padding:Common.scaleSize(15),flexDirection:'row'}}>
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}} source={Images.my_info}/>
                          <Text style={{alignSelf:"center",color:"#333",fontSize:Common.scaleSize(15),marginLeft:Common.scaleSize(20)}}>个人资料</Text>
                        </View>
                      </Button>
                      <Button onPress={()=>{this.action('idcard')}}>
                        <View style={{paddingLeft:Common.scaleSize(40),padding:Common.scaleSize(15),flexDirection:'row'}}>
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}}source={Images.my_rz}/>
                          <Text style={{alignSelf:"center",color:"#333",fontSize:Common.scaleSize(15),marginLeft:Common.scaleSize(20)}}>身份认证</Text>
                        </View>
                      </Button>
                      <Button onPress={()=>{this.action('invite')}}>
                        <View style={{paddingLeft:Common.scaleSize(40),padding:Common.scaleSize(15),flexDirection:'row'}}>
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}} source={Images.my_invite}/>
                          <Text style={{alignSelf:"center",color:"#333",fontSize:Common.scaleSize(15),marginLeft:Common.scaleSize(20)}}>邀请好友</Text>
                        </View>
                      </Button>
                      <Button onPress={()=>{this.action('feedback')}}>
                        <View style={{paddingLeft:Common.scaleSize(40),padding:Common.scaleSize(15),flexDirection:'row'}}>
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}} source={Images.my_fee}/>
                          <Text style={{alignSelf:"center",color:"#333",fontSize:Common.scaleSize(15),marginLeft:Common.scaleSize(20)}}>意见反馈</Text>
                        </View>
                      </Button>
                      <Button onPress={()=>{this.action('about')}}>
                        <View style={{paddingLeft:Common.scaleSize(40),padding:Common.scaleSize(15),flexDirection:'row'}}>
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}} source={Images.my_about}/>
                          <Text style={{alignSelf:"center",color:"#333",fontSize:Common.scaleSize(15),marginLeft:Common.scaleSize(20)}}>关于我们</Text>
                        </View>
                      </Button>
                      <Button onPress={()=>{this.action('setting')}}>
                        <View style={{paddingLeft:Common.scaleSize(40),padding:Common.scaleSize(15),flexDirection:'row'}}>
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}}source={Images.my_set}/>
                          <Text style={{alignSelf:"center",color:"#333",fontSize:Common.scaleSize(15),marginLeft:Common.scaleSize(20)}}>设置</Text>
                        </View>
                      </Button>
                  </View>
                </View>
                
              </ScrollView>
              </TouchableWithoutFeedback>
            }>
                {this.props.children}
            </Drawer>
        )
  }
}