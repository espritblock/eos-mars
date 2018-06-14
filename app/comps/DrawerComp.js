import React, { Component } from 'react'
import {Text,Dimensions,View,Image} from 'react-native'
import {NetImg,Common,Images,Colors} from '../utils';
import Globle from '../utils/Globle';
import {Button} from '../comps'
var screen = Dimensions.get('window');

/**
 *  DrawerComp create by espritblock 
 */
export default class DrawerComp extends Component {
  
  state = {
   login:Globle.login
  }

  constructor(props){
    super(props)
  }
  
  render(){
    return (
        <View style={{flex:1,flexDirection:"column"}}>
          
              <View style={{width:screen.width*0.7,backgroundColor:'#fff'}}>
                
                  <View source={Images.wallet_top} style={{height:Common.scaleSize(280),backgroundColor:Colors.mainColor}}>
                    <View>
                      <Image
                        resizeMode="cover"
                        style={{width:Common.scaleSize(70),height:Common.scaleSize(70),borderRadius:Common.scaleSize(35),marginTop:Common.scaleSize(30),marginBottom:Common.scaleSize(3),alignSelf:"center"}}
                        source={this.state.login.photo?{uri:NetImg.small(this.state.login.photo)}:Images.head}/>
                        <View style={{flexDirection:"row",justifyContent:"center",paddingTop:Common.scaleSize(15)}}>
                          <Text style={{alignSelf:"center",fontSize:Common.scaleSize(15),color:'#fff'}}>{this.state.login.nickname}</Text><Image style={{alignSelf:"center",marginLeft:Common.scaleSize(5),width:Common.scaleSize(13),height:Common.scaleSize(13)}} source={this.state.login.sex==0?Images.sex0:Images.sex1} />
                        </View>
                        <Text style={{fontSize:Common.scaleSize(14),color:'#fff',padding:Common.scaleSize(5),width:'100%',textAlign:'center'}}>{this.state.login.username}</Text>
                        <Text style={{fontSize:Common.scaleSize(12),color:'#fff',lineHeight:Common.scaleSize(26),paddingTop:0,padding:Common.scaleSize(10),width:'100%',textAlign:'center'}}>{this.state.login.sign?this.state.login.sign:'这家伙很懒，没有个性签名'}</Text>
                    </View>
                  </View>
                  <View style={{marginTop:Common.scaleSize(50),marginBottom:Common.scaleSize(50),flexDirection:'column'}}>
                      <Button onPress={()=>{this.action('info')}}>
                        <View style={{paddingLeft:Common.scaleSize(40),padding:Common.scaleSize(15),flexDirection:'row'}}>
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}} source={Images.my_rz}/>
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
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}} source={Images.my_help}/>
                          <Text style={{alignSelf:"center",color:"#333",fontSize:Common.scaleSize(15),marginLeft:Common.scaleSize(20)}}>关于我们</Text>
                        </View>
                      </Button>
                      {/* <Button onPress={()=>{this.action('help')}}>
                        <View style={{paddingLeft:Common.scaleSize(40),padding:Common.scaleSize(15),flexDirection:'row'}}>
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}} source={Images.my_help}/>
                          <Text style={{alignSelf:"center",color:"#333",fontSize:Common.scaleSize(15),marginLeft:Common.scaleSize(20)}}>帮助</Text>
                        </View>
                      </Button> */}
                      <Button onPress={()=>{this.action('setting')}}>
                        <View style={{paddingLeft:Common.scaleSize(40),padding:Common.scaleSize(15),flexDirection:'row'}}>
                          <Image resizeMode="contain" style={{alignSelf:"center",width:Common.scaleSize(18),height:Common.scaleSize(18)}}source={Images.my_set}/>
                          <Text style={{alignSelf:"center",color:"#333",fontSize:Common.scaleSize(15),marginLeft:Common.scaleSize(20)}}>设置</Text>
                        </View>
                      </Button>
                  </View>
                </View>
   
        </View>
    )
  }
}
