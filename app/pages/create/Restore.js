import React from 'react';
import { connect } from 'react-redux';
import {TouchableWithoutFeedback,ScrollView,View,Image,Dimensions,Text,TextInput,DeviceEventEmitter,Platform} from 'react-native';
import {Dialog,Toast,Button,Loading,TextButton,ImageButton,LineView} from '../../comps'
import {Colors,Globle,Images,NavUtils,Security,Common,Api} from '../../utils'
import I18n from '../../language/Ii8n'
import {Eos} from 'react-native-eosjs'
const screen = Dimensions.get('window');
var ownerPrivate;
var ownerPublic;
/**
 * Restore create by espritblock 
 */
@connect(({ identity }) => ({ ...identity }))
class Restore extends React.Component {

  static navigationOptions = {
    title:I18n.t("Restore.title")
  };

  state = {
      pk:'',
      username:'',
      pass:'',
      repass:''
  }

  protor = ()=>{
    NavUtils.navigation("Web",{title:I18n.t("Restore.userpro"),"url":Api.htmlService});
  }

  next = () =>{
    this.clearBlur();
    if(this.state.pk.trim()==""){
        Toast.show(I18n.t("Restore.inputpk"));
        return;
    }
    if(this.state.pass.trim()=="" || this.state.pass.length<8){
        Toast.show(I18n.t("Restore.inputPass"));
        return;
    }
    if(this.state.repass.trim()!=this.state.pass.trim()){
        Toast.show(I18n.t("Restore.nosame"));
        return;
    }
    //生成私钥
    Loading.show("处理中");
    setTimeout(() => {this.doRestore();},500);
  }

  doRestore = () =>{
    Eos.checkPrivateKey(this.state.pk,result => {
        if(result && result.isSuccess){
            ownerPrivate = this.state.pk;
            Eos.privateToPublic(ownerPrivate,r=>{
                if(r && r.isSuccess){
                    ownerPublic = r.data.publicKey;
                    this.excuteRestore();
                }else{
                    Loading.dismis();
                    Toast.show("生成公钥失败");
                }
            });
        }else{
            Loading.dismis();
            Toast.show("私钥格式错误");
        }
    });
  }

  excuteRestore = () =>{
    if(ownerPrivate && ownerPublic){
        //盐
        let salt = Security.salt();
        //密码pbkdf2
        let password = Security.pbkdf2(this.state.pass.trim(),salt);
        //im密码
        let impassword = Security.md5(Security.salt());
        //签名版本
        let version = Security.md5(Security.salt());
        //数据签名
        let data = Security.parseSignParams({username:this.state.username.trim(),publickey:ownerPublic,impassword,version});
        //数据签名
        Eos.sign(data,ownerPrivate,(r)=>{
            if(r.isSuccess){
                this.props.dispatch({type: 'identity/restore',payload:{salt,sign:r.data,nickname:this.state.username.trim(),ownerPrivate,ownerPublic,password,impassword,version},callback:(data)=>{
                    Loading.dismis();
                    if(data.code==0){
                        Toast.show(I18n.t("Restore.success"));
                        NavUtils.reset('Home');
                    }else{
                        Toast.show(data.msg);
                    }
                }});
            }else{
                Loading.dismis();
                Toast.show("恢复失败");
            }
        });
    }else{
        Loading.dismis();
        Toast.show("恢复失败~");
    }
  }

  /**
   * 清楚焦点
   */
  clearBlur = () =>{
    this._pk.blur();
    this._username.blur();
    this._password.blur();
    this._rpassword.blur();
  }

  render() {
    return(<View style={{height:'100%',backgroundColor:'#ffffff'}}>
      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback onPress={()=>this.clearBlur()}>
          <View style={{flex:1,flexDirection:'column',padding:Common.scaleSize(30)}}>
              <View style={{flexDirection:'column',marginTop:Common.scaleSize(10)}}>
                 <Text style={{fontSize:Common.scaleSize(14),color:"#333333"}}>{I18n.t("Restore.helpWord")}</Text>
                 <TextInput ref={(ref)=>this._pk=ref} autoCapitalize="none" keyboardType={Platform.OS=="ios"?"ascii-capable":"email-address"} multiline={true} value={this.state.zjc} returnKeyType="next" selectionColor={Colors.mainColor} style={{textAlignVertical:'top',padding:Common.scaleSize(7),color:'#666666', fontFamily: 'PingFangSC-Regular',fontSize: Common.scaleSize(14),height:Common.scaleSize(100),borderColor:'#f1f1f1',borderWidth:Common.scaleSize(0.6),marginTop:Common.scaleSize(10),borderRadius:Common.scaleSize(4)}} placeholderTextColor="#999999" placeholder={I18n.t("Restore.helpWordTip")} underlineColorAndroid="transparent" maxLength={1000} onChangeText={(pk) => this.setState({pk})} />
              </View>
              <View style={{flexDirection:'row',paddingTop:Common.scaleSize(10)}}>
                 <TextInput ref={(ref) => this._username = ref} returnKeyType="next" onSubmitEditing={() => this._password.focus()} autoCapitalize="none" keyboardType={Platform.OS=="ios"?"ascii-capable":"email-address"} placeholder={I18n.t("Create.name")} value={this.state.username} selectionColor={Colors.mainColor} style={{color:'#666666', fontFamily: 'PingFangSC-Regular',fontSize: Common.scaleSize(14),height:Common.scaleSize(50),borderColor:'#f1f1f1',width:"100%"}} placeholderTextColor="#999999" underlineColorAndroid="transparent" maxLength={12} onChangeText={(username) => this.setState({username})} />
              </View>
              <LineView />
              <View style={{flexDirection:'row',paddingTop:Common.scaleSize(10)}}>
                 <TextInput ref={(ref) => this._password = ref} returnKeyType="next" onSubmitEditing={() => this._rpassword.focus()}  placeholder={I18n.t("Create.inputPass")} value={this.state.pass} secureTextEntry={true} selectionColor={Colors.mainColor} style={{color:'#666666', fontFamily: 'PingFangSC-Regular',fontSize: Common.scaleSize(14),height:Common.scaleSize(50),borderColor:'#f1f1f1',width:"100%"}} placeholderTextColor="#999999" underlineColorAndroid="transparent" maxLength={20} onChangeText={(pass) => this.setState({pass})} />
              </View>
              <LineView />
              <View style={{flexDirection:'row',paddingTop:Common.scaleSize(10)}}>
                 <TextInput ref={(ref) => this._rpassword = ref} returnKeyType="go" onSubmitEditing={() => this.next()}   placeholder={I18n.t("Restore.confimPass")} value={this.state.repass} secureTextEntry={true} selectionColor={Colors.mainColor} style={{color:'#666666', fontFamily: 'PingFangSC-Regular',fontSize: Common.scaleSize(14),height:Common.scaleSize(50),borderColor:'#f1f1f1',width:"100%"}} placeholderTextColor="#999999" underlineColorAndroid="transparent" maxLength={20} onChangeText={(repass) => this.setState({repass})} />
              </View>
              <LineView />
              <Text onPress={()=>{this.protor()}} style={{color:'#666666', fontFamily: 'PingFangSC-Regular',fontSize: Common.scaleSize(12),marginTop:Common.scaleSize(20),textDecorationLine: 'underline'}}>{I18n.t("Restore.proto")}</Text>
              <TextButton onPress={()=>{this.next()}} text={I18n.t("Restore.next")} bgColor={Colors.mainColor} textColor="#ffffff"  style={{marginTop:50}}/>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
  </View>);
  }
}

export default Restore;
