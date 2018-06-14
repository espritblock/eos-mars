import React from 'react';
import { connect } from 'react-redux';
import {ScrollView,View,Text,Image,StyleSheet,Dimensions,Clipboard} from 'react-native';
import {Dialog,Toast,Button,Loading,TextButton,ImageButton,LineView,UICell} from '../../comps'
import {Colors,Globle,Images,NetImg} from '../../utils'
import I18n from '../../language/Ii8n'
import {NavUtils}from '../../utils';
import Common from '../../utils/Common';
const screen = Dimensions.get('window');
import moment from 'moment';
require('moment/locale/zh-cn');

/**
 * TxInfo create by espritblock 
 */
@connect(({ wallet }) => ({ ...wallet }))
class TxInfo extends React.Component {

    static navigationOptions = {
        title:"转账详情"
    };

    componentWillUnmount() {
        this.props.dispatch({type:'wallet/clearTx',payload:{}});
    }

    componentDidMount(){
        let txid = this.props.navigation.state.params.txid;
        this.props.dispatch({type:'wallet/transaction',payload:{txid}});
    }

    user = () =>{
        if(this.props.tx.uid){
            NavUtils.navigation("UserSpace",{uid:this.props.tx.uid});
        }
    }

    render() {
        return(
            <ScrollView keyboardShouldPersistTaps="always" style={{backgroundColor:"#fff"}}>
                {
                    this.props.tx && <View style={{backgroundColor:"#fff",flexDirection:"column"}}>
                    <View style={{padding:Common.scaleSize(30),flexDirection:"column",justifyContent:"center",alignSelf:"center"}}>
                       <Button onPress={()=>{this.user()}}>
                            <View style={{flexDirection:"row",alignSelf:"center"}}>
                                {
                                    this.props.tx.uid && <Image source={this.props.tx.photo?{uri:NetImg.small(this.props.tx.photo)}:Images.head} style={{alignSelf:"center",width:Common.scaleSize(35),height:Common.scaleSize(35),borderRadius:Common.scaleSize(17.5)}} />
                                }
                                <Text style={{alignSelf:"center",marginLeft:Common.scaleSize(8),color:"#000",fontSize:Common.scaleSize(15)}}>{this.props.tx.nickname}</Text>
                            </View>
                        </Button>
                        <Text style={{alignSelf:"center",marginTop:Common.scaleSize(10),color:"#000",fontSize:Common.scaleSize(28)}}>{this.props.tx.qua} {this.props.tx.coin}</Text>
                        <Text style={{alignSelf:"center",marginTop:Common.scaleSize(8),color:"#999",fontSize:Common.scaleSize(15)}}>{this.props.tx.status==0?"等待确认":"交易成功"}</Text>
                    </View>
                    <View style={{flexDirection:"row",borderBottomWidth:0.5,borderBottomColor:"#efefef"}}>
                        <Text style={styles.left}>处理进度</Text>
                        <View style={[styles.right]}>
                            <View>
                                <View style={[styles.econtent,{flexDirection:"column"}]}>   
                                    <View style={{flexDirection:"row",alignSelf:"center"}}>
                                        <Image source={Images.isok} resizeMode="contain" style={{width:Common.scaleSize(16),height:Common.scaleSize(16),marginHorizontal:Common.scaleSize(5),alignSelf:"center"}} />
                                        <Text style={[styles.eleft,{color:this.props.tx.sendDate?Colors.mainColor:"#999"}]}>付款成功</Text>
                                        <Text style={styles.eright}>{this.props.tx.sendDate?moment(this.props.tx.sendDate).format('MM-DD  HH:mm'):"-----------------"}</Text>
                                    </View>
                                    <View style={{height:Common.scaleSize(30),marginLeft:Common.scaleSize(13),backgroundColor:this.props.tx.confirmDate?Colors.mainColor:"#999",width:Common.scaleSize(1.3)}}></View>
                                </View>
                                <View style={[styles.econtent,{flexDirection:"column"}]}>   
                                    <View style={{flexDirection:"row",alignSelf:"center"}}>
                                        <Image source={Images.isok} resizeMode="contain" style={{width:Common.scaleSize(16),height:Common.scaleSize(16),marginHorizontal:Common.scaleSize(5),alignSelf:"center"}} />
                                        <Text style={[styles.eleft,{color:this.props.tx.confirmDate?Colors.mainColor:"#999"}]}>网络确认</Text>
                                        <Text style={styles.eright}>{this.props.tx.confirmDate?moment(this.props.tx.confirmDate).format('MM-DD  HH:mm'):"-----------------"}</Text>
                                    </View>
                                    <View style={{height:Common.scaleSize(30),marginLeft:Common.scaleSize(13),backgroundColor:this.props.tx.overDate?Colors.mainColor:"#999",width:Common.scaleSize(1.3)}}></View>
                                </View>
                                <View style={styles.econtent}>
                                    <Image source={Images.isok} resizeMode="contain" style={{width:Common.scaleSize(16),height:Common.scaleSize(16),marginHorizontal:Common.scaleSize(5),alignSelf:"center"}} />
                                    <Text style={[styles.eleft,{color:this.props.tx.overDate?Colors.mainColor:"#999"}]}>交易成功</Text>
                                    <Text style={styles.eright}>{this.props.tx.overDate?moment(this.props.tx.overDate).format('MM-DD  HH:mm'):"-----------------"}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",borderBottomWidth:0.5,borderBottomColor:"#efefef"}}>
                        <Text style={styles.left}>交易类型</Text>
                        <Text style={styles.right}>{this.props.tx.type}</Text>
                    </View>
                    <View style={{flexDirection:"row",borderBottomWidth:0.5,borderBottomColor:"#efefef"}}>
                        <Text style={styles.left}>转账备注</Text>
                        <Text style={styles.right}>{this.props.tx.memo}</Text>
                    </View>
                    <View style={{flexDirection:"row",borderBottomWidth:0.5,borderBottomColor:"#efefef"}}>
                        <Text style={styles.left}>交易时间</Text>
                        <Text style={styles.right}>{moment(this.props.tx.createdate).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    </View>
                    <View style={{flexDirection:"row",borderBottomWidth:0.5,borderBottomColor:"#efefef"}}>
                        <Text style={styles.left}>交易ID</Text>
                        <Text numberOfLines={1} onPress={()=>{Clipboard.setString(this.props.tx.txid);Toast.show("交易ID已复制");}} style={styles.right}>{this.props.tx.txid}</Text>
                    </View>
                </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    left: {
        alignSelf:"center",
        width:Common.scaleSize(100),
        color:"#0b0817",
        fontSize:Common.scaleSize(14),
        padding:Common.scaleSize(15)
    },
    right: {
        alignSelf:"center",
        color:"#666",
        fontSize:Common.scaleSize(13),
        padding:Common.scaleSize(15),
        textAlign:"right",
        width:screen.width-Common.scaleSize(100)
    },
    eleft:{
        paddingHorizontal:Common.scaleSize(10),
        color:Colors.mainColor,
        alignSelf:"center",
        fontSize:Common.scaleSize(14)
    },
    eright:{
        paddingHorizontal:Common.scaleSize(10),
        color:"#666",
        alignSelf:"center",
        fontSize:Common.scaleSize(9)
    },
    econtent:{
        alignSelf:"flex-end",
        flexDirection:"row"
    }
})

export default TxInfo;