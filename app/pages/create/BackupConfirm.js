import React from 'react';
import { connect } from 'react-redux';
import {TouchableWithoutFeedback,ScrollView,View,Text,TextInput,StyleSheet,DeviceEventEmitter,Platform} from 'react-native';
import {Dialog,Toast,Button,Loading,TextButton} from '../../comps';
import {Colors,Images,NavUtils,Common} from '../../utils';
import Globle from '../../utils/Globle'
import I18n from '../../language/Ii8n';

/**
 * BackupConfirm create by espritblock 
 */
@connect(({ identity }) => ({ ...identity }))
class BackupConfirm extends React.Component {

    state = {
        pk:""
    }
    
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        if(params.isCreate){
            return {
                title:I18n.t("backup.backup"),
              headerRight: (
                <Button onPress={params.onPress}>
                  <Text style={{color:'#ffffff',fontSize:15,padding:10}}>跳过</Text>
                </Button>
              ),
            };
        }else{
            return {
                title:I18n.t("backup.backup")
            };
        }
    };

    /**
     * 初始化
     */
    componentDidMount(){
        //设置调整方法
        this.props.navigation.setParams({onPress:this.forward});
    }
    
    /**
     * 跳过
     */
    forward = () =>{
        NavUtils.reset('Home');
    }

    submitButtonClicked = (e) => {
        this._input.blur();
        if(this.state.pk.trim().length>0){
            if(this.props.navigation.state.params.pk==this.state.pk.trim()){
                this.props.dispatch({type:'identity/backup',payload:{},callback:(res)=>{
                    Toast.show(I18n.t("BackupConfirm.success"));
                    if(this.props.navigation.state.params.isCreate){
                        NavUtils.reset('Home');
                    }else{
                        const {goBack} = this.props.navigation;
                        goBack();
                        DeviceEventEmitter.emit("back");
                    }
                }});
            }else{
                Toast.show(I18n.t("BackupConfirm.error"));
            }
        }else{
            Toast.show("请输入私钥");
        }
    }
    render() {
        return(
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
             <TouchableWithoutFeedback onPress={()=>this._input.blur()}>
                <View style={styles.content}>
                    <Text style={styles.name}>{I18n.t("BackupConfirm.name")}</Text>
                    <Text style={styles.explain}>{I18n.t("BackupConfirm.explain")}</Text>
                    <View style={{flexDirection:'column',marginTop:Common.scaleSize(30)}}>
                        <Text style={{fontSize:Common.scaleSize(14),color:"#333333"}}>{I18n.t("Restore.helpWord")}</Text>
                        <TextInput autoCapitalize="none" keyboardType={Platform.OS=="ios"?"ascii-capable":"email-address"} ref={(ref)=>{this._input=ref}} multiline={true} value={this.state.zjc} returnKeyType="go" selectionColor={Colors.mainColor} style={{textAlignVertical:'top',padding:Common.scaleSize(7),color:'#666666', fontFamily: 'PingFangSC-Regular',fontSize: Common.scaleSize(14),height:Common.scaleSize(100),borderColor:'#f1f1f1',borderWidth:0.7,marginTop:Common.scaleSize(20),borderRadius:4}} placeholderTextColor="#999999" placeholder={I18n.t("Restore.helpWordTip")} underlineColorAndroid="transparent" maxLength={1000} onChangeText={(pk) => this.setState({pk})} />
                    </View>
                    <View>
                        <TextButton onPress={()=>{this.submitButtonClicked()}} bgColor={Colors.mainColor} textColor="#fff" text={I18n.t("BackupConfirm.submit")} style={{marginTop:48}} />
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
    },
    content: {
        width:"100%",
        paddingRight:Common.scaleSize(30),
        paddingLeft:Common.scaleSize(30),
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: Common.scaleSize(44),
    },
    name: {
        fontSize: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(20),
        color: '#333333',
        alignSelf: 'center',
    },
    explain: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(13),
        color: '#666666',
        marginTop: Common.scaleSize(10),
        alignSelf:'center',
    },
    termsback: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#f1f1f1',
        paddingTop: Common.scaleSize(16),
        paddingBottom: Common.scaleSize(16),
        paddingLeft: Common.scaleSize(16),
        paddingRight: Common.scaleSize(16),
        marginTop: Common.scaleSize(23),
        borderRadius: 4,
        minHeight: 20,
    },
    tremsConfirmBack: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: Common.scaleSize(16),
        borderRadius: 4,
        marginTop: Common.scaleSize(4)
    },
    term: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(15),
        color: '#333333',
        lineHeight: Common.scaleSize(24),
        alignSelf: 'flex-start',
        paddingLeft: Common.scaleSize(4),
        paddingRight: Common.scaleSize(4),
        margin: Common.scaleSize(5),
    },
    termConfirmButtoned: {
        backgroundColor: '#7fa5d1',
    },
    termConfirmButtonDefault: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#999999',
    },
    termConfirmButton:{
        marginLeft: Common.scaleSize(8),
        marginRight: Common.scaleSize(8),
        marginTop: Common.scaleSize(16),
        borderRadius: 2,
    },
    termConfirm: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(15),
        lineHeight: Common.scaleSize(24),
        alignSelf: 'flex-start',
        paddingBottom: Common.scaleSize(8),
    },
    submitButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Common.scaleSize(50),
        backgroundColor: Colors.mainColor,
        borderRadius: 4,
        marginTop: Common.scaleSize(48),
    },
    submitText: { 
        fontFamily: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(15),
        color: '#FFFFFF',
    },
    selected:{
        backgroundColor:Colors.mainColor,
        color:'#fff'
    }
})
export default BackupConfirm;