import React from 'react';
import { connect } from 'react-redux'
import {View} from 'react-native';
import {NavUtils}from '../utils';
import Globle from '../utils/Globle';

/**
 * Splash create by espritblock 
 */
@connect(({globle}) => ({...globle}))
class Splash extends React.Component {
  
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var th = this;
    //初始化navigation
    NavUtils.initNavigation(this.props.navigation);
    //加载初始化信息
    this.props.dispatch({type: 'globle/init',payload:{},callback:(data)=>{
      if(Globle.login && Globle.wallet && Globle.login!=null && Globle.wallet!=null){
        NavUtils.reset('Home');
      }else{
        NavUtils.reset('CreateBoot');
      }
    }});
  }

  render() {
    return (
      <View/>
    );
  }
}

export default Splash;