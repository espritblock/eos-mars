import React from 'react';
import { connect } from 'react-redux';
import {ScrollView,View,Text,Image,StyleSheet} from 'react-native';
import {Dialog,Toast,Button,Loading,TextButton,ImageButton,LineView} from '../../comps'
import {Colors,Globle,Images} from '../../utils'
import I18n from '../../language/Ii8n'
import {NavUtils}from '../../utils';
import Common from '../../utils/Common';

/**
 * CreateSuccess create by espritblock 
 */
class CreateSuccess extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
          title:I18n.t("backup.backup"),
          headerRight: (
            <Button onPress={params.onPress}>
              <Text style={{color:'#ffffff',fontSize:15,padding:10}}>跳过</Text>
            </Button>
          ),
        };
    };

    /**
     * 跳过
     */
    forward = () =>{
        NavUtils.reset('Home');
    }

    /**
     * 初始化
     */
    componentDidMount(){
        //设置调整方法
        this.props.navigation.setParams({onPress:this.forward});
    }

    /**
     * 备份
     */
    backupButtonClicked = () => {
        NavUtils.navigation("Backup",{isCreate:true});
    }

    render() {
        return(
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                <View style={styles.content}>
                    <Image style={styles.image} source={Images.create_success} />
                    <Text style={styles.title}>{I18n.t("CreateSuccess.success")}</Text>
                    <Text style={styles.explain}>{I18n.t("CreateSuccess.explain")}</Text>
                    <View style={{width:"100%"}}>
                        <TextButton onPress={()=>{this.backupButtonClicked()}} bgColor={Colors.mainColor} textColor="#fff" text={I18n.t("CreateSuccess.backup")} style={{marginTop:118}} />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
    },
    content: {
        paddingLeft: Common.scaleSize(30),
        paddingRight: Common.scaleSize(30),
        alignItems: 'center',
        width:"100%"
    },
    image: {
        width: Common.scaleSize(110),
        height: Common.scaleSize(110),
        marginTop: Common.scaleSize(38),
    },
    title: {
        fontFamily: 'PingFangSC-Medium',
        fontSize: Common.scaleSize(20),
        color: '#333333',
        marginTop: Common.scaleSize(23),
    },
    explain: {
        fontSize: Common.scaleSize(13),
        color: '#666666',
        lineHeight:Common.scaleSize(20),
        marginTop: Common.scaleSize(20),
        
    },
    backupButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: Common.scaleSize(50),
        width: '100%',
        backgroundColor: Colors.mainColor,
        borderRadius: 4,
        marginTop: Common.scaleSize(118),
    },
    backupText: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(15),
        color: '#FFFFFF', 
    },
    backupExplainButton: {
        marginTop: Common.scaleSize(10),
        height: Common.scaleSize(44),
        justifyContent: 'center',
    },
    backupExplainText: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(12),
        color: '#333333',
        opacity: 0.6,
    },
});
export default CreateSuccess;