import React from 'react';
import { connect } from 'react-redux'
import {StackNavigator} from 'react-navigation';
import {View,BackHandler,DeviceEventEmitter,Platform} from 'react-native';
import {Colors,Emiter,Common} from '../utils'
import {Toast} from '../comps'
import Splash from './Splash'
import Web from '../pages/Web'
import Restore from '../pages/create/Restore'
import Create from '../pages/create/Create'
import CreateSuccess from '../pages/create/CreateSuccess'
import Backup from '../pages/create/Backup'
import BackupConfirm from '../pages/create/BackupConfirm'
import CreateIndex from '../pages/create/CreateIndex'
import SplashScreen from 'react-native-splash-screen'
import Transfer from '../pages/wlet/Transfer';
import ReceivableCode from '../pages/wlet/ReceivableCode';
import Tab from './Tab';
import TxInfo from '../pages/wlet/TxInfo'

/**
 * Route create by espritblock 
 */
const Navigator = StackNavigator(
  {
    Splash:{
      screen:Splash
    },
    CreateBoot:{
      screen:CreateIndex
    },
    Restore:{
      screen:Restore
    },
    Create:{
      screen:Create
    },
    CreateSuccess:{
      screen:CreateSuccess
    },
    Backup:{
      screen:Backup
    },
    BackupConfirm:{
      screen:BackupConfirm
    },
    Transfer:{
      screen: Transfer
    },
    ReceivableCode:{
      screen:ReceivableCode
    },
    Web:{
      screen:Web
    },
    TxInfo:{
      screen:TxInfo
    },
    Home: {
      screen: Tab,
      navigationOptions: {
        headerLeft: null,
        headerRight:null,
      }
    }
  },
  {
    navigationOptions: () => ({
      gesturesEnabled:true,
      headerTitleStyle: {
        fontWeight: 'normal',
        color:'#ffffff',
        fontSize:Common.scaleSize(16),
        alignSelf:'center'
      },
      headerBackTitle:null,
      headerBackTitleStyle:{
        color:'#ffffff'
      },
      headerTintColor:'#ffffff',
      headerStyle:{
        backgroundColor:Colors.headerColor,
        height:Common.scaleSize((Platform.OS=='ios')?50:72),
        paddingTop:Common.scaleSize((Platform.OS=='ios')?0:18)
      },
      headerRight: (
        <View style={{height: Common.scaleSize(44),width:Common.scaleSize(55),justifyContent: 'center',paddingRight:Common.scaleSize(15)} }/>
      ),
      mode: 'card',
      headerMode: 'screen'
    }),
  }
);

@connect(({globle}) => ({...globle}))
export default class Route extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    //关闭欢迎页
    setTimeout(() => {
      SplashScreen.hide();
    },1000);
    //初始化配置
    this.props.dispatch({type: 'globle/init',payload:{},callback:(data)=>{
    
    }});
  }

  componentWillMount(){
    if (Platform.OS !== 'ios') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    if (Platform.OS !== 'ios') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  onBackAndroid = () => {
    if(routeLength==1){
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        return false;
      }
      this.lastBackPressed = Date.now();
      Toast.show('再按一次退出应用');
      return true;
    }else{
      return false;
    }
  };

  //tab切换后发送消息
  switchRoute = (oldnav, newNav, action) => {
    if(action && action.routeName){
      DeviceEventEmitter.emit(Emiter.tab_main_change,action.routeName);
    }
    routeLength = newNav.routes.length;
  }
  
  render() {
    return (<View style={{flex:1}}>
      <Navigator onNavigationStateChange={(oldnav, newNav, action) => {this.switchRoute(oldnav, newNav, action)}} />
      <View style={{position:'absolute',zIndex:100000,top:0,left:0}}>
      </View>
    </View>)
  }
}
const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}
