import React, { Component } from 'react'
import {View,Platform,TouchableHighlight,TouchableNativeFeedback} from 'react-native'

/**
 *  Button create by espritblock 
 */
export default class Button extends Component {
  constructor(props){
    super(props)
  }
  render(){
    return Platform.OS === 'ios'?(
      <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" {...this.props}>{this.props.children}</TouchableHighlight>
    ):(
      <View {...this.props}><TouchableNativeFeedback onPress={this.props.onPress}>{this.props.children}</TouchableNativeFeedback></View>
    )
  }
}
