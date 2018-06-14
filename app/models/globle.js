import DeviceInfo from 'react-native-device-info';
import store from 'react-native-simple-store';
import {Request,Api} from '../utils';
import Globle from '../utils/Globle';
import {Toast}from '../comps'

/**
 *  globle create by espritblock 
 */
export default {

    namespace: 'globle',

    state: {
        
    },

    effects: {
      /**
       * 初始化配置
       * @param {*} param0 
       * @param {*} param1 
       */
      *init({payload,callback}, { call, put }) {
        try{
          const wallet = yield call(store.get, 'wallet_info');
          const login = yield call(store.get, 'login_info');
          Globle.login = login;
          Globle.wallet = wallet;
          Globle.device.appVersion = DeviceInfo.getVersion();
          Globle.device.os = DeviceInfo.getSystemName();
          Globle.device.osVersion = DeviceInfo.getSystemVersion();
          Globle.device.model = DeviceInfo.getModel();
          Globle.device.deviceId = DeviceInfo.getDeviceId();
          Globle.device.serial = DeviceInfo.getSerialNumber();
          if(callback)callback();
        }catch(e){
          Toast.show("初始化失败")
        }
      }
    },
    reducers: {
        
    },
    subscriptions: {
     
    }
  }
  