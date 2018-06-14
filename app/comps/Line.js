import React, { Component } from 'react'
import {View} from 'react-native'
import {Common} from '../utils';

/**
 *  Line create by espritblock 
 */
export default class Line extends Component {
  
  constructor(props){
    super(props)
  }
  
  render(){
    return (
        <View style={[this.props.style,{backgroundColor:'#e5e5ee',width:"100%",height:Common.scaleSize(0.3)}]}></View>
    )
  }
}
