import React, { Component } from 'react';
import {Platform,StyleSheet,Text,View,Image,Switch,TouchableHighlight} from 'react-native';
import {Images,Common} from '../utils';
import Colors from '../utils/Colors';

/**
 *  UICell create by espritblock 
 */
class UICell extends Component {
    // 构造
    static defaultProps = {
        title: '',          // 左边标题
        icon:'',            // 左边图标
        rightTitle: '',     // 右边标题
        rightIcon: '',      // 右边图标
        isSwitch: false,    // 是否显示切换
        isLine: true,       // 是否显示分割线
        switch:false,
    };
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isOn: props.switch,
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            isOn:nextProps.switch
        })
    }

    render(){
        return (
            <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" {...this.props}>
                {this.initView()}
            </TouchableHighlight> 
        );
        // return Platform.OS === 'ios'?(
        //   <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" {...this.props}>
        //     <View>{this.initView()}</View>
        //   </TouchableHighlight>
        // ):(
        //   <View {...this.props}><TouchableNativeFeedback onPress={this.props.onPress}>
        //     {this.initView()}
        //   </TouchableNativeFeedback></View>
        // )
    }
    initView() {
        return (
            <View style={styles.back}>
                <View style={styles.container}>
                    {/* 左边 */}
                    {this.renderLeftView()}
                    {/* 右边 */}
                    {this.renderRightView()}
                </View>
                {/* 分割线 */}
                {this.line()}
            </View>
        )
    }
    // 左边
    renderLeftView() {
        if(this.props.icon.length > 0)
        {
            return (
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image
                        style={styles.icon}
                        source={{uri:this.props.icon}}
                    />
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
            )
        }
        else
        {
            return (
                <Text style={styles.title}>{this.props.title}</Text>
            )
        }
    }
    // 右边
    renderRightView() {
        if (this.props.isSwitch) {
            return (
                <View style={styles.rightView}>
                    {this.rightTitleOrImage()}
                    <Switch value={this.state.isOn} onTintColor={Platform.OS=="ios"?Colors.mainColor:null}  onValueChange={()=>{this.switchValueChange()}}/>
                </View>
            );
        }
        else {
            return (
                <View style={styles.rightView}>
                    {this.rightTitleOrImage()}
                    {
                        !this.props.rightIcon && <Image
                        style={styles.rightImage}
                        source={Images.right}
                    />
                    }
                    
                </View>
            );
        }
    }
    rightTitleOrImage() {
        if(this.props.rightTitle.length > 0)
        {
            return (
                <Text style={styles.rightTitle}>{this.props.rightTitle}</Text>
            );
        }
        else if(this.props.rightIcon.length > 0)
        {
            return (
                <Image
                    style={styles.rightIcon}
                    source={{uri:this.props.rightIcon}}
                />
            );
        }
    }
    line() {
        if(this.props.isLine == true) {
            return (
                <View style={styles.line}></View>
            );
        } else {
            return null;
        }
    }

    switchValueChange() {
        this.setState({
            isOn: !this.state.isOn,
        });
        if(this.props.switchHander){
            this.props.switchHander(!this.state.isOn);
        }
    }
}

const styles = StyleSheet.create({
    back: {
        backgroundColor: '#ffffff'
    },
    container: {
        height: Common.scaleSize(55),
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'PingFangSC-Regular',
        opacity: 0.8,
        fontSize: Common.scaleSize(14.5),
        color: '#0b0817',
        marginLeft: Common.scaleSize(30),
    },
    icon: {
        width:Common.scaleSize(28),
        height:Common.scaleSize(28),
        marginLeft:Common.scaleSize(8),
        borderRadius:Common.scaleSize(14)
    },
    rightView: {
        marginRight: Common.scaleSize(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightTitle: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: Common.scaleSize(13.5),
        marginRight: Common.scaleSize(8),
        color: '#666666',
        opacity: 0.7,
    },
    rightImage: {
        width: Common.scaleSize(16),
        height: Common.scaleSize(16),
    },
    rightIcon: {
        width:Common.scaleSize(24),
        height:Common.scaleSize(13),
        marginRight:Common.scaleSize(8),
    },
    line: {
        height:0.5,
        backgroundColor: "#999999",
        marginLeft: Common.scaleSize(30),
        opacity: 0.2,
    }
});

export default UICell;
