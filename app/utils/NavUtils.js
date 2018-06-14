import { NavigationActions} from 'react-navigation';
import {DeviceEventEmitter} from 'react-native';
import Emiter from './Emiter';

var nav;
var drawer;

const initNavigation = (navigation) => {
  nav = navigation;
}

const initDrawer = (dr) => {
  drawer = dr;
}

const navigation = (navgation,data) =>{
  const {navigate} = nav;
  navigate(navgation,data);
}

const reset = (routeName) => {
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })]
  });
  nav.dispatch(resetAction);
};

const openDrawer = (side) =>{
  DeviceEventEmitter.emit("initDrawer",side);
  setTimeout(() => {
    drawer.open();
  }, 200);
  
}

export default {
  reset,
  openDrawer,
  navigation,
  initNavigation,
  initDrawer
};
