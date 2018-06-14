
import Globle from '../utils/Globle';

const request = (url, method, body) => {
    let isOk;
    return new Promise((resolve, reject) => {
      let df,uf = {};
      if(Globle){
        df = {
          "appVersion":Globle.device.appVersion,
          "os":Globle.device.os,
          "osVersion":Globle.device.osVersion,
          "model":Globle.device.model,
          "deviceId":Globle.device.deviceId,
          "serial":Globle.device.serial,
        }
      }
      if(Globle.login){
        uf = {
          uid:Globle.login.id,
          token:Globle.login.token
        }
      }
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          ...df,
          ...uf
        },
        body:JSON.stringify(body)
      })
        .then((response) => {
          if (response.ok) {
            isOk = true;
          } else {
            isOk = false;
          }
          return response.json();
        })
        .then((responseData) => {
          if (isOk) {
            resolve(responseData);
          } else {
            reject(responseData);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  export default {
    request
  };
  