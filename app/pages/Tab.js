import React, { Component } from 'react'
import {TabNavigator} from 'react-navigation';
import {Image,View,Dimensions,Text} from 'react-native';
import {Images,Colors,Common} from '../utils'
import wlet from './wlet'
const screen = Dimensions.get('window');

/**
 * Tab create by espritblock 
 */
const TabContainer = TabNavigator(
  {
    wlet: { screen: wlet },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'wlet':
            iconName = focused?Images.tab_1_h:Images.tab_1
            break;
        }
        return (<Image source={iconName} style={{width:Common.scaleSize(25),height:Common.scaleSize(25),padding:0}}/>);
      },
    }),
    lazy: true,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: Colors.tabTintColor,
      inactiveTintColor: Colors.tabInvColor,
      showIcon: true,
      showLabel:true,
      style: {
        height:Common.scaleSize(49),
        backgroundColor: Colors.tabColor
      },
      labelStyle:{
        fontSize:Common.scaleSize(10),
        marginTop:Common.scaleSize(2)
      },
      indicatorStyle: {
        opacity: 0
      },
      tabStyle: {
        padding: 0,
        margin:0
      }
    }
  }
);

export default class Tab extends Component {

    state = {
        unread:0
    }

    static navigationOptions = {
        header:null
    };

    render(){
        return <View style={{flex:1}}><TabContainer></TabContainer>
            {
                this.state.unread>0 && <View style={{zIndex:0,alignItems:'center',justifyContent:'center',left:(screen.width/4)*1+(screen.width/4)/2+15,top:screen.height-(screen.height==812?Common.scaleSize(75):Common.scaleSize(45)),width:17,height:17,borderRadius:8.5,backgroundColor:'#ff8960',position:'absolute'}}>
                <Text style={{color:'#fff',fontSize:Common.scaleSize(8)}}>
                    {this.state.unread}
                </Text>
                </View>
            }
        </View>
  }
}
