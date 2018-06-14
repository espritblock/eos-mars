import store from 'react-native-simple-store';
import {Request,Api,Security} from '../utils';
import Globle from '../utils/Globle';

/**
 *  identity create by espritblock 
 */
export default {

    namespace: 'identity',
    
    state: {
      
    },
    
    effects: {
      /**
       * 创建账户
       * @param {*} param0 
       * @param {*} param1 
       */
      *create({payload,callback},{call,put}) {
        try{
          //盐
          let salt = payload.salt;
          //用户密码
          let password = payload.password;
          //im密码
          let impassword = payload.impassword;
          //私钥加密
          let activePrivate= Security.encrypt(payload.ownerPrivate,password);
          //活动公钥
          let activePublicKey= payload.ownerPublic;
          //超级公钥
          let ownerPublicKey = activePublicKey;
          //昵称
          let username = payload.nickname;
          //签名
          let sign = payload.sign;
          //版本
          let version = payload.version;
          //提交请求
          const resp = yield call(Request.request,Api.register,'post',{username,ownerPublicKey,activePublicKey,version,impassword,sign});
          //提交成功，保持用户信息到本地
          if(resp.code==0){
            //是否为首次注册
            Globle.isReg = resp.data.isReg;
            //登陆信息
            Globle.login=resp.data;
            //im密码
            Globle.login.impassword = impassword;
            //钱包信息
            Globle.wallet={};
            //活动私钥(已通过密码加密)
            Globle.wallet.privateKey=activePrivate
            //活动公钥
            Globle.wallet.publicKey=activePublicKey
            //盐
            Globle.wallet.salt = salt;
            //是否备份过
            Globle.wallet.backup = false;
            //账户
            Globle.wallet.name = resp.data.username;
            //保存登陆信息
            yield call(store.save, 'login_info',Globle.login);
            //保存钱包信息
            yield call(store.save, 'wallet_info',Globle.wallet);
          }
          if(callback)callback(resp);
        }catch(e){
          if(callback)callback({code:500,msg:"创建失败"});
        } 
      },
      /**
       * 恢复账户
       * @param {*} param0 
       * @param {*} param1 
       */
      *restore({payload,callback},{call,put}) {
        try{
          //盐
          let salt = payload.salt;
          //用户密码
          let password = payload.password;
          //im密码
          let impassword = payload.impassword;
          //私钥加密
          let activePrivate= Security.encrypt(payload.ownerPrivate,password);
          //活动公钥
          let activePublicKey= payload.ownerPublic;
          //超级公钥
          let ownerPublicKey = activePublicKey;
          //昵称
          let username = payload.nickname;
          //签名
          let sign = payload.sign;
          //版本
          let version = payload.version;
          //提交请求
          const resp = yield call(Request.request,Api.login,'post',{sign,username,publickey:activePublicKey,impassword,version});
          //提交成功，保持用户信息到本地
          if(resp.code==0){
            //是否为注册
            Globle.isReg = resp.data.isReg;
            //登陆信息
            Globle.login=resp.data;
            //im密码
            Globle.login.impassword = impassword;
            //钱包信息
            Globle.wallet={};
            //活动私钥已通过密码加密)
            Globle.wallet.privateKey=activePrivate
            //活动公钥(
            Globle.wallet.publicKey=activePublicKey
            //盐
            Globle.wallet.salt = salt;
            //是否备份过
            Globle.wallet.backup = true;
            //账户
            Globle.wallet.name = resp.data.username;
            //保存登陆信息
            yield call(store.save, 'login_info',Globle.login);
            //保存钱包信息
            yield call(store.save, 'wallet_info',Globle.wallet);
          }
          if(callback)callback(resp);
        }catch(e){
          if(callback)callback({code:500,msg:"创建失败"});
        } 
      },
      /**
       * 备份账户
       * @param {*} param0 
       * @param {*} param1 
       */
      *backup({payload,callback},{call,put}) {
        //设置为已备份
        Globle.wallet.backup = true;
        //保存
        yield call(store.save, 'wallet_info',Globle.wallet);
        //回调
        callback(true);
      },
      /**
       * 退出
       * @param {*} param0 
       * @param {*} param1 
       */
      *logout({payload,callback},{call,put}) {
        //清空登陆信息
        Globle.login=null;
        //清空钱包信息
        Globle.wallet=null;
        //保存登陆信息
        yield call(store.save, 'login_info',Globle.login);
        //保存钱包信息
        yield call(store.save, 'wallet_info',Globle.wallet);
        callback(true);
      }
    },
    reducers: {
    
    },
  }
  