import React, { Component } from 'react'
import {DeviceEventEmitter,Text,View,WebView,Animated,Dimensions,StyleSheet} from 'react-native'
import {Colors} from '../utils'
import Common from '../utils/Common';
import {Button} from '../comps'
const { width } = Dimensions.get('window')

/**
 * Web create by espritblock 
 */
export default class Web extends Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
      return {title:navigation.state.params.title,
      
        headerRight: (navigation.state.params.news && <Button onPress={navigation.state.params.onPress}>
          <View style={{padding:15}}>
            <Text style={{fontSize:Common.scaleSize(13),color:"#fff"}}>分享</Text>
          </View>
        </Button>
      ),
    }
  }

  share = () =>{
    DeviceEventEmitter.emit("news_share",this.props.navigation.state.params.news);
  }
  constructor(props){
      super(props)
      this.state = {
        progress: new Animated.Value(10),
        error: false
      }
      this.props.navigation.setParams({onPress:this.share});
      let noop = () => {}
      this.__onLoad = this.props.onLoad || noop
      this.__onLoadStart = this.props.onLoadStart || noop
      this.__onError = this.props.onError || noop
  }

  _onLoad(){
    Animated.timing(this.state.progress, {
      toValue: width,
      duration: 200
    }).start(() => {
      setTimeout(() => {
        this.state.progress.setValue(0);
      }, 300)
    })
    this.__onLoad()
  }

  _onLoadStart(){
    this.state.progress.setValue(0);
    Animated.timing(this.state.progress, {
      toValue: width*.7,
      duration: 5000
    }).start()
    this.__onLoadStart()
  }

  _onError(){
    setTimeout(() => {
      this.state.progress.setValue(0);
    }, 300)
    this.setState({error: true})
    this.__onError()
  }

  render(){
    return (
      <View style={{flex: 1, backgroundColor:Colors.background}}>
        <WebView
          source={{uri:this.props.navigation.state.params.url}}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          style={[styles.webview_style]}
          onLoad={this._onLoad.bind(this)}
          onLoadStart={this._onLoadStart.bind(this)}
          onError={this._onError.bind(this)}
        >
        </WebView>
        <View style={[styles.infoPage, this.state.error?styles.showInfo:{}]}>
          
        </View>
        <Animated.View style={[styles.progress, {width:this.state.progress}]}></Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  webview_style: {
    flex: 1,
    backgroundColor: Colors.background
  },
  progress: {
    position: "absolute",
    height: 2,
    left: 0,
    top: 0,
    overflow: "hidden",
    backgroundColor: Colors.mainColor
  },
  infoPage:{
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    paddingTop: 50,
    alignItems: "center",
    transform: [
      {translateX: width}
    ],
    backgroundColor: Colors.background
  },
  showInfo: {
    transform: [
      {translateX: 0}
    ]
  }
})