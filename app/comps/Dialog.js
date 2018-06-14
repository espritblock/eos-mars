import React from 'react';
import {StyleSheet,Modal,Text,Platform,TouchableHighlight,KeyboardAvoidingView,TouchableWithoutFeedback,View,Dimensions} from 'react-native';
import { material } from 'react-native-typography';
import ProgressBar from "./ProgressBar";
import {Colors,Common} from '../utils'
const { height } = Dimensions.get('window');
var ScreenWidth = Dimensions.get('window').width;
const prs = 0;
const tk = null;
/**
 *  Button create by espritblock 
 */
export class Dialog {
    
    constructor() {
    
    }

    static bind(dialog) {
        this.map["dialog"] = dialog;
    }

    static unBind() {
        this.map["dialog"] = dialog;
        delete this.map["dialog"];
    }

    static show(title,content,okLable,disLabel,okHandler,cancelHander) {
        this.map["dialog"].setState({ 
            "visible": true,
            title,
            content,
            okLable,
            disLabel,
            okHandler,
            cancelHander
        })
    }

    static dismis() {
        this.map["dialog"].setState({
            "visible":false
        });
    }

    static startProgress(){
      this.map["dialog"].setState({okHandler:null,disLabel:null,showProgress:true});
      var th = this;
      tk = setInterval(function(){
        th.map["dialog"].setState({progress:prs})
      },300);
    }

    static endProgress(){
      clearInterval(tk);
    }

    static progress(total,current){
      let p = current/total;
      prs = parseInt((ScreenWidth-32)*p);
    }
}

Dialog.map = {};
export class DialogView extends React.Component {

    state = {
        visible:false,
        showProgress:false,
        progress:0
    }

    constructor(props) {
        super(props);
        Dialog.bind(this);
    }
    
    render() {
        return (
          <Modal
            animationType={'fade'}
            transparent
            hardwareAccelerated
            visible={this.state.visible}
            onRequestClose={()=>{}}
            supportedOrientations={['portrait', 'landscape']}>
            <TouchableWithoutFeedback>
              <View style={styles.backgroundOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                  <View style={[styles.modalContainer,styles.modalContainerPadding]}>
                    <TouchableWithoutFeedback>
                      <View>
                        <View style={styles.titleContainer}>
                            <Text style={[material.title,{color:Colors.mainColor,fontSize:Common.scaleSize(17)}]}>{this.state.title}</Text>
                        </View>
                        <View style={[styles.contentContainer,styles.contentContainerPadding]}>
                          {(typeof(this.state.content)=='string')?<Text style={{lineHeight:Common.scaleSize(20)}}>{this.state.content}</Text>:this.state.content}
                        </View>
                        <View style={styles.actionsContainer}>
                          {this.state.disLabel && this.state.disLabel!=null ?(
                            <TouchableHighlight
                              testID="dialog-cancel-button"
                              style={styles.actionContainer}
                              underlayColor="#F0F0F0"
                              onPress={()=>this.state.cancelHander()}>
                              <Text style={[material.button, { color: Colors.mainColor }]}>{this.state.disLabel}</Text>
                            </TouchableHighlight>
                          ):null
                        }
                        {this.state.okHandler && this.state.okHandler!=null ?(
                            <TouchableHighlight
                              testID="dialog-ok-button"
                              style={styles.actionContainer}
                              underlayColor="#F0F0F0"
                              onPress={()=>this.state.okHandler()}>
                              <Text style={[material.button, { color: Colors.mainColor }]}>{this.state.okLable}</Text>
                            </TouchableHighlight>
                          ):null
                        }
                        {this.state.showProgress?<ProgressBar
                            style={{marginTop:Common.scaleSize(49),width:ScreenWidth-Common.scaleSize(32)}}
                            progress={this.state.progress}
                          />:null}
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </TouchableWithoutFeedback>
          </Modal>)
    }
}

const styles = StyleSheet.create({
  backgroundOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalContainer: {
    marginHorizontal: Common.scaleSize(16),
    marginVertical:  Common.scaleSize(106),
    minWidth:  Common.scaleSize(280),
    borderRadius:  Common.scaleSize(2),
    elevation: 24,
    overflow: 'hidden',
    backgroundColor:"#ffffff",
    borderRadius: 5,
  },
  modalContainerPadding: {
    paddingTop: 24,
  },
  titleContainer: {
    paddingHorizontal:  Common.scaleSize(24),
    paddingBottom:  Common.scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleContainerScrolled: {
    paddingHorizontal:  Common.scaleSize(24),
    paddingBottom:  Common.scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#DCDCDC",
  },
  contentContainer: {
    flex: -1,
  },
  contentContainerPadding: {
    paddingHorizontal:  Common.scaleSize(24),
    paddingBottom:  Common.scaleSize(24),
  },
  contentContainerScrolled: {
    flex: -1,
    maxHeight: height - 264, // (106px vertical margin * 2) + 52px
  },
  contentContainerScrolledPadding: {
    paddingHorizontal:  Common.scaleSize(24),
  },
  actionsContainer: {
    height:  Common.scaleSize(52),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft:  Common.scaleSize(8),
  },
  actionsContainerScrolled: {
    height:  Common.scaleSize(52),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft:  Common.scaleSize(8),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#DCDCDC",
  },
  actionContainer: {
    marginRight:  Common.scaleSize(8),
    paddingHorizontal:  Common.scaleSize(8),
    paddingVertical:  Common.scaleSize(8),
    minWidth:  Common.scaleSize(64),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
