import React from 'react';
import { connect } from 'react-redux';
import {TouchableWithoutFeedback,ScrollView,View,Text,TextInput,StyleSheet,DeviceEventEmitter,Platform} from 'react-native';
import {Dialog,Toast,Button,Loading,ImageButton,TextButton} from '../../comps'
import {Colors,Images,Security,Common,Api} from '../../utils'
import Globle from '../../utils/Globle'
import I18n from '../../language/Ii8n';
import {NavUtils}from '../../utils';
import {Eos} from 'react-native-eosjs'
var ownerPrivate;
var ownerPublic;
/**
 * Create create by espritblock 
 */
@connect(({ identity }) => ({ ...identity }))
class Create extends React.Component {

    /**
     * 导航
     */
    static navigationOptions = {
        title:I18n.t("Create.create")
    };

    /**
     * 状态
     */
    state = {
        nickname:"",
        password:"",
        rpassword:"",
    }

    /**
     * 初始化
     */
    componentDidMount(){
        //生成私钥
        Eos.randomPrivateKey(result=>{
            if(result.isSuccess){
                ownerPrivate = result.data.ownerPrivate;
                ownerPublic = result.data.ownerPublic;
            }else{
                Toast.show(result.msg);
            }
        });
    }

    /**
     * 服务协议
     */
    agreementButtonClicked = () => {
        NavUtils.navigation("Web",{title:I18n.t("Restore.userpro"),"url":Api.htmlService});
    } 

    /**
     * 清除焦点
     */
    clearBlur = () =>{
        this._nickname.blur();
        this._password.blur();
        this._rpassword.blur();
    }

    /**
     * 创建点击
     */
    createButtonClicked = () => {
        this.clearBlur();
        if(this.state.nickname.trim()=="" || this.state.nickname.length!=12){
            Toast.show(I18n.t("Create.inputNickname"));
            return;
        }
        if(!/^[1-5a-z.]+$/.test(this.state.nickname)){
            Toast.show("输入错误，只能输入1-5，a-z，.");
            return;
        }
        if(this.state.password.trim()=="" || this.state.password.trim().length<8){
            Toast.show(I18n.t("Create.inputPass"));
            return;
        }
        if(this.state.password.trim()!=this.state.rpassword.trim()){
            Toast.show(I18n.t("Create.inputConfirmPass"));
            return;
        }
        if(ownerPrivate && ownerPublic){
            Loading.show(I18n.t("common.creating"));
            setTimeout(() => {this.doCreate();},500);
        }else{
            Toast.show(I18n.t("Create.createError"));
            return;
        }
    };

    /**
     * 创建
     */
    doCreate = () => {
        //盐
        let salt = Security.salt();
        //密码pbkdf2
        let password = Security.pbkdf2(this.state.password.trim(),salt);
        //im密码
        let impassword = Security.md5(Security.salt());
        //签名版本
        let version = Security.md5(Security.salt());
        //数据签名
        let data = Security.parseSignParams({username:this.state.nickname.trim(),activePublicKey:ownerPublic,ownerPublicKey:ownerPublic,impassword,version});
        //签名
        Eos.sign(data,ownerPrivate,(result)=>{
            if(result.isSuccess){
                //注册账户
                this.props.dispatch({type: 'identity/create',payload:{salt,sign:result.data,ownerPrivate,ownerPublic,nickname:this.state.nickname.trim(),password,impassword,version},callback:(data)=>{
                    Loading.dismis();
                    if(data.code==0){
                        NavUtils.reset('CreateSuccess');
                    }else{
                        Toast.show(data.msg);
                    }
                }});
            }else{
                Loading.dismis();
                Toast.show(I18n.t("Create.createError"));
            }
        });
    }

    render() {
        return(
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
             <TouchableWithoutFeedback onPress={()=>this.clearBlur()}>
                <View style={styles.content}>
                    <View style={styles.explain}>
                        <Text style={styles.explainText}>{I18n.t("Create.explainOne")}</Text>
                        <Text style={styles.explainText}>{I18n.t("Create.explainThr")}</Text>
                        <Text style={styles.explainText}>{I18n.t("Create.explainFive")}</Text>
                    </View>
                    <TextInput ref={(ref) => this._nickname = ref} returnKeyType="next" onSubmitEditing={() => this._password.focus()} autoCapitalize="none" keyboardType={Platform.OS=="ios"?"ascii-capable":"email-address"} onChangeText={(nickname) => this.setState({nickname:nickname.toLowerCase()})}  maxLength={12} style={[styles.textInput, styles.name]} selectionColor={Colors.mainColor} placeholder={I18n.t("Create.name")} underlineColorAndroid="transparent" placeholderTextColor={"#999999"}/>
                    <TextInput ref={(ref) => this._password = ref} returnKeyType="next" onSubmitEditing={() => this._rpassword.focus()} onChangeText={(password) => this.setState({password})}  maxLength={20} style={[styles.textInput, styles.pwd]} selectionColor={Colors.mainColor} secureTextEntry={true}  underlineColorAndroid="transparent" placeholder={I18n.t("Create.pass")} placeholderTextColor={"#999999"} />
                    <TextInput ref={(ref) => this._rpassword = ref} returnKeyType="go"  onSubmitEditing={() => this.createButtonClicked()} onChangeText={(rpassword) => this.setState({rpassword})}  maxLength={20} style={[styles.textInput, styles.pwd]} selectionColor={Colors.mainColor} secureTextEntry={true}  underlineColorAndroid="transparent" placeholder={I18n.t("Create.confimPass")} placeholderTextColor={"#999999"} />
                    <Button style={styles.agreementButton} onPress={()=>{this.agreementButtonClicked()}}>
                        <Text style={styles.agreement}>{I18n.t("Create.proto")}</Text>
                    </Button>
                    <TextButton onPress={()=>{this.createButtonClicked()}} text={I18n.t("Create.create")} bgColor={Colors.mainColor} textColor="#ffffff"  style={{marginTop:50}}/>
                </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
    },
    content: {
        marginLeft: Common.scaleSize(30),
        marginRight: Common.scaleSize(30),
    },
    textInput: {
        height: Common.scaleSize(48),
        fontSize: Common.scaleSize(14),
        borderBottomColor: '#e5e5ee',
        borderBottomWidth: Common.scaleSize(0.4),
        width:'100%'
    },
    name: {
        marginTop: Common.scaleSize(12),
    },
    pwd: {
        marginTop: Common.scaleSize(12),
    },
    seeButton: {
        borderBottomColor: '#e5e5ee',
        borderBottomWidth: Common.scaleSize(1),
        height: Common.scaleSize(48),
        width: Common.scaleSize(48),
        justifyContent: 'center',
        alignItems: 'center',
    },
    agreementButton: {
        
        marginTop:Common.scaleSize(20),
        alignSelf: 'flex-start',
    },
    agreement: {
        
        fontFamily: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(12),
        color: '#666666',
        textDecorationLine: 'underline'
    },
    createButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.mainColor,
        borderRadius: Common.scaleSize(4),
        width:'100%',
        margin:Common.scaleSize(20)
    },
    createText: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(15),
        color: '#FFFFFF',
    },
    explain: {
        backgroundColor: 'rgba(94,185,246,0.20)',
        marginTop: Common.scaleSize(30),
        opacity: 0.5,
        borderWidth:0.5,
        borderColor: '#51a9e4',
        padding:Common.scaleSize(10),
        justifyContent: 'center',
        marginBottom: Common.scaleSize(10),
    },
    explainText: {
        fontSize: Common.scaleSize(12),
        fontFamily: 'PingFangSC-Regular',
        color: '#666666',
        lineHeight: Common.scaleSize(19),
    }
})
export default Create;