import React, { Component } from 'react'
import {View,Text,Platform,TouchableHighlight,TouchableNativeFeedback} from 'react-native'
import Common from '../utils/Common';

/**
 *  TextButton create by espritblock 
 */
export default class TextButton extends Component {
  
  static defaultProps = {
    borderRadius:3,
  };
  constructor(props){
    super(props)
  }
  
  render(){
    return (
    <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" onPress={this.props.onPress} style={[{borderRadius:this.props.borderRadius},this.props.style]}>
      <View style={{borderRadius:this.props.borderRadius,backgroundColor:this.props.bgColor,padding:Common.scaleSize(14)}}>
        <Text style={{color:this.props.textColor,fontSize:Common.scaleSize(14),textAlign:'center'}}>{this.props.text}</Text>
      </View>
    </TouchableHighlight>
    )
  }
}
