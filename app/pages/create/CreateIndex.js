import React from 'react';
import { connect } from 'react-redux';
import {View,Image,Dimensions,Text,ImageBackground,StyleSheet} from 'react-native';
import {Dialog,Toast,TextButton,ImageButton} from '../../comps'
import {Colors,Globle,Images,Security,NavUtils,Common} from '../../utils'
import I18n from '../../language/Ii8n'
const screen = Dimensions.get('window');

/**
 * CreateIndex create by espritblock 
 */
class CreateIndex extends React.Component {

  /**
   * 隐藏导航栏
   */
  static navigationOptions = {
    header:null
  };

  /**
   * 创建账户
   */
  create = () =>{
    NavUtils.navigation("Create",{});
  }

  /**
   * 恢复账户
   */
  reset = () =>{
    NavUtils.navigation("Restore",{});
  }

  render() {
    return <ImageBackground style={styles.back} source={Images.create_bg} >
      <View style={styles.container}>
          <View style={styles.logoview}>
            <Image source={Images.app_logo} style={styles.logo} />
          </View>
          <Text style={styles.wellcome}>{I18n.t("CreateIndex.wellcome")}</Text>
          <Text style={styles.tip}>{I18n.t("CreateIndex.actionTip")}</Text>
      </View>
      <View style={styles.bottom}>
        <TextButton onPress={()=>{this.create()}} text={I18n.t("CreateIndex.create")} bgColor="#fff" textColor={Colors.mainColor} />
        <TextButton onPress={()=>{this.reset()}} text={I18n.t("CreateIndex.reset")} bgColor={Colors.transport} textColor="#fff" style={styles.restorebtn} />
      </View>
    </ImageBackground>;
  }
}

const styles = StyleSheet.create({
  back:{
    width:"100%",
    height:"100%"
  },
  container:{
    height:screen.height/2,
    width:'100%',
    justifyContent:'center',
    alignSelf:'center',
    padding:Common.scaleSize(30),
    flexDirection:'column'
  },
  logoview:{
    justifyContent:'center',
    alignSelf:'center'
  },
  logo:{
    width:Common.scaleSize(85),
    height:Common.scaleSize(85)
  },
  wellcome:{
    width:'100%',
    textAlign:'center',
    letterSpacing:Common.scaleSize(4),
    fontSize:Common.scaleSize(23),
    marginTop:Common.scaleSize(50),
    color:'#ffffff'
  },
  tip:{
    width:'100%',
    textAlign:'center',
    letterSpacing:Common.scaleSize(2),
    fontSize:Common.scaleSize(14),
    marginTop:Common.scaleSize(10),
    color:'rgba(255,255,255,0.7)'
  },
  bottom:{
    height:screen.height/2,
    width:'100%',
    padding:Common.scaleSize(30),
    justifyContent:'center',
    alignSelf:'center',
    flexDirection:'column'
  },
  restorebtn:{
    borderColor:'#fff',
    borderWidth:0.8,
    marginTop:Common.scaleSize(20)
  }
});

export default CreateIndex;
