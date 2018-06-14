import React, { Component } from 'react'
import {Image,TouchableHighlight} from 'react-native'
/**
 *  ImageButton create by espritblock 
 */
export default class ImageButton extends Component {
  
  constructor(props){
    super(props)
  }
  
  render(){
    return (
    <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" onPress={this.props.onPress} {...this.props}>
      <Image 
        source={this.props.source}
        resizeMode="contain"
        width={this.props.width} 
        height={this.props.height} 
        style={[this.props.cycle?{borderRadius:this.width/2}:{}]} />
    </TouchableHighlight>
    )
  }
}
