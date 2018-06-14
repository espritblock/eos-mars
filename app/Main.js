import React from 'react';
import {StatusBar,Platform,View} from 'react-native';
import {Colors} from "./utils";
import {LoadingView,ToastView,DialogView,AuthView} from './comps';
import Drawer from './pages/Drawer'
import Route from "./pages/Route";
import {EosProvider} from 'react-native-eosjs'
/**
 * Main create by espritblock 
 */
const Main = () => (
  <View style={{flex:1}}>
    {Platform.OS === 'ios' && <StatusBar barStyle="default" backgroundColor={Colors.statusColor} />}
    {Platform.OS === 'android' && <StatusBar barStyle="dark-content" backgroundColor='rgba(0,0,0,0)' translucent={true}  />}
    <EosProvider server="http://54.238.242.48:8888" />
    <AuthView />
    <DialogView />
    <LoadingView />
    <ToastView />
    <Drawer>
      <Route />
    </Drawer>
  </View>
);

export default Main;




