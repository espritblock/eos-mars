import React from 'react';
import { connect } from 'react-redux';
import {ScrollView, View,Text,StyleSheet,DeviceEventEmitter} from 'react-native';
import {Button,Auth,TextButton} from '../../comps';
import {Colors,Common} from '../../utils';
import I18n from '../../language/Ii8n';
import {NavUtils}from '../../utils';

/**
 * Backup create by espritblock 
 */
@connect(({ identity }) => ({ ...identity }))
class Backup extends React.Component {

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
     * 跳过
     */
    forward = () =>{
        NavUtils.reset('Home');
    }

    /**
     * 下一步
     */
    nextButtonClicked = () => {
        NavUtils.navigation("BackupConfirm",{pk:this.state.pk,isCreate:this.props.navigation.state.params.isCreate});
    }

    /**
     * 初始化
     */
    componentDidMount(){
        var th = this;
        //设置调整方法
        this.props.navigation.setParams({onPress:this.forward});
        //验证密码
        Auth.show(false,function(result){
            Auth.dismis();
            th.setState({pk:result})
        },function(){
            Auth.dismis();
            const {goBack} = th.props.navigation;
            goBack();
        });
        this.backLister = DeviceEventEmitter.addListener("back",()=>{
            const {goBack} = this.props.navigation;
            goBack();
        })
    }

    componentWillUnmount(){
        this.setState({pk:""});
        this.backLister.remove();
    }

    render() {
        return(
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>{I18n.t("backup.title")}</Text>
                    <Text style={styles.explain}>{I18n.t("backup.info")}</Text>
                    <View style={styles.termsback}>
                        <Text style={styles.term}>{this.state.pk}</Text>
                    </View>
                    <View>
                        <TextButton onPress={()=>{this.nextButtonClicked()}} bgColor={Colors.mainColor} textColor="#fff" text={I18n.t("backup.next")} style={{marginTop:178}} />
                    </View>  
                </View>
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
        marginLeft:  Common.scaleSize(30),
        marginRight:  Common.scaleSize(30),
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop:  Common.scaleSize(44),
    },
    title: {
        fontSize: 'PingFangSC-Regular',
        fontSize:  Common.scaleSize(20),
        color: '#333333',
        alignSelf: 'center',
    },
    explain: {
        fontFamily: 'PingFangSC-Regular',
        fontSize:  Common.scaleSize(13),
        color: '#666666',
        lineHeight:Common.scaleSize(20),
        marginTop:  Common.scaleSize(16),
    },
    termsback: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#f1f1f1',
        paddingTop:  Common.scaleSize(16),
        paddingBottom:  Common.scaleSize(16),
        paddingLeft:  Common.scaleSize(16),
        paddingRight:  Common.scaleSize(16),
        marginTop:  Common.scaleSize(23),
        borderRadius: 4,
        minHeight:  Common.scaleSize(20)
    },
    term: {
        fontFamily: 'PingFangSC-Regular',
        fontSize:  Common.scaleSize(15),
        color: '#333333',
        lineHeight:  Common.scaleSize(24),
        alignSelf: 'flex-start',
        paddingLeft:  Common.scaleSize(4),
        paddingRight:  Common.scaleSize(4),
    },
    nextButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height:  Common.scaleSize(50),
        backgroundColor: Colors.mainColor,
        borderRadius: 4,
        marginTop:  Common.scaleSize(178),
    },
    nextText: { 
        fontFamily: 'PingFangSC-Regular',
        fontSize:  Common.scaleSize(15),
        color: '#FFFFFF',
    },
})
export default Backup;