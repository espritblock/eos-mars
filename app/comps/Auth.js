import React from 'react';
import {StyleSheet,Modal,Text,Platform,TouchableHighlight,KeyboardAvoidingView,TouchableWithoutFeedback,View,Dimensions,TextInput,Image} from 'react-native';
import { connect } from 'react-redux';
import { material } from 'react-native-typography';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import {Colors,Images,Security,Common} from '../utils'
import Globle from '../utils/Globle'
import { Toast } from './Toast';
const { height } = Dimensions.get('window');
var ScreenWidth = Dimensions.get('window').width;

/**
 *  Auth create by espritblock 
 */
export class Auth {

    static bind(dialog) {
        this.map["dialog"] = dialog;
    }

    static unBind() {
        this.map["dialog"] = dialog;
        delete this.map["dialog"];
    }

    static show(isAddFinger,okHandler,cancelHander) {
        this.map["dialog"].init({ 
          visible: true,
          fingerInfo:'',
          password:'',
          okHandler,
          cancelHander,
          isAddFinger,
          isFinger:isAddFinger?true:((Globle.wallet.finger)?Globle.wallet.finger:false)
      });
    }

    static dismis() {
        this.map["dialog"].destory();
    }
}

Auth.map = {};

@connect(({ identity }) => ({ ...identity }))
export class AuthView extends React.Component {

    state = {
        visible:false,
        password:'',
        isAddFinger:false,
    }

    constructor(props, context) {
      super(props, context);
      Auth.bind(this);
    }

    handleAuthenticationAttempted = (error) => {
      Toast.show("指纹错误");
    };

    init = (data) =>{
      this.setState({...data});
      if(data.isFinger){
        FingerprintScanner.authenticate({ onAttempt: this.handleAuthenticationAttempted })
          .then(() => {
            if(this.state.isAddFinger){
              this.setState({isFinger:false})
            }else{
              this.state.okHandler(true);
            }
          }).catch((error) => {

          });
      }
    }

    destory = () =>{
      FingerprintScanner.release();
      this.setState({visible:false});
    }

    ok = () =>{
      this._input.blur();
      if(this.state.password==""){
        Toast.show("请输入密码");
        return;
      }
      try{
        let pk = Security.decrypt(Globle.wallet.privateKey,Security.pbkdf2(this.state.password.trim(),Globle.wallet.salt));
        if(pk!="" && pk.length>0){
          this.state.okHandler(pk);
        }else{
          Toast.show("密码错误，请重试")
        }
      }catch(e){
        Toast.show("密码错误，请重试")
      }
    }

    close = () =>{
      if(this.state.cancelHander){
        this.state.cancelHander();
      }else{
        this.destory();
      }
    }
    
    render() {
        return (
          <Modal
            animationType={'fade'}
            transparent
            hardwareAccelerated
            visible={this.state.visible}
            onRequestClose={()=>{}}
            supportedOrientations={['portrait', 'landscape']}>
            <TouchableWithoutFeedback>
              <View style={styles.backgroundOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                  <View style={[styles.modalContainer,styles.modalContainerPadding]}>
                    <TouchableWithoutFeedback>
                      <View>
                        <View style={styles.titleContainer}>
                            <Text style={[material.title,{color:Colors.mainColor,fontSize:17}]}>{this.state.isAddFinger?"设置指纹":"验证身份"}</Text>
                        </View>
                        <View style={[styles.contentContainer,styles.contentContainerPadding]}>
                            {
                               this.state.isFinger && <Image style={{width:Common.scaleSize(70),height:Common.scaleSize(70),justifyContent:'center',alignSelf:'center'}} source={Images.finger} />
                            }
                            {
                               this.state.isFinger===false &&  <TextInput ref={(ref)=>{this._input=ref}} autoFocus={true} onChangeText={(password) => this.setState({password})} returnKeyType="go" onSubmitEditing={()=>{this.ok()}} keyboardType="ascii-capable" style={{width:ScreenWidth-100,color:Colors.mainColor,height:45,fontSize:15,borderBottomColor: '#e5e5ee',borderBottomWidth:0.5,}} secureTextEntry={true} placeholder="输入账户密码" selectionColor={Colors.mainColor} underlineColorAndroid="transparent" placeholderTextColor={"#999999"} maxLength={20}/>
                            }
                        </View>
                        <View style={styles.actionsContainer}>
                            <TouchableHighlight
                              testID="dialog-cancel-button"
                              style={styles.actionContainer}
                              underlayColor="#F0F0F0"
                              onPress={()=>{this.close()}}>
                              <Text style={[material.button, { color: Colors.mainColor }]}>取消</Text>
                            </TouchableHighlight>
                            
                            {
                              (!this.state.isAddFinger && this.state.isFinger)&& <TouchableHighlight
                                testID="dialog-ok-button"
                                style={styles.actionContainer}
                                underlayColor="#F0F0F0"
                                onPress={()=>{this.setState({isFinger:false});FingerprintScanner.release();}}>
                                <Text style={[material.button, { color: Colors.mainColor }]}>密码</Text>
                              </TouchableHighlight>
                            }
                            {
                              this.state.isFinger===false &&<TouchableHighlight
                                testID="dialog-ok-button"
                                style={styles.actionContainer}
                                underlayColor="#F0F0F0"
                                onPress={()=>this.ok()}>
                                <Text style={[material.button, { color: Colors.mainColor}]}>确定</Text>
                              </TouchableHighlight>
                            }
                            
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </TouchableWithoutFeedback>
          </Modal>)
    }
}

const styles = StyleSheet.create({
  backgroundOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalContainer: {
    marginHorizontal: Common.scaleSize(16),
    marginVertical: Common.scaleSize(106),
    minWidth: Common.scaleSize(280),
    borderRadius: 2,
    elevation: 24,
    overflow: 'hidden',
    backgroundColor:"#ffffff",
    borderRadius: 5,
  },
  modalContainerPadding: {
    paddingTop: Common.scaleSize(24),
  },
  titleContainer: {
    paddingHorizontal: Common.scaleSize(24),
    paddingBottom: Common.scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleContainerScrolled: {
    paddingHorizontal: Common.scaleSize(24),
    paddingBottom: Common.scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#DCDCDC",
  },
  contentContainer: {
    flex: -1,
  },
  contentContainerPadding: {
    paddingHorizontal:Common.scaleSize(24),
    paddingBottom: Common.scaleSize(24),
  },
  contentContainerScrolled: {
    flex: -1,
    maxHeight: height - 264, // (106px vertical margin * 2) + 52px
  },
  contentContainerScrolledPadding: {
    paddingHorizontal: Common.scaleSize(24),
  },
  actionsContainer: {
    height: Common.scaleSize(52),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: Common.scaleSize(8),
  },
  actionsContainerScrolled: {
    height: Common.scaleSize(52),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: Common.scaleSize(8),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#DCDCDC",
  },
  actionContainer: {
    marginRight: Common.scaleSize(8),
    paddingHorizontal: Common.scaleSize(8),
    paddingVertical: Common.scaleSize(8),
    minWidth: Common.scaleSize(64),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
