import {Request,Api} from '../utils';
import {Toast} from '../comps'
import Globle from '../utils/Globle'
import store from 'react-native-simple-store';

/**
 *  wallet create by espritblock 
 */
export default {
    namespace: 'wallet',
    state: {
      transloading: false,
      datas:[],
      balance:0,
      purseCoins:[]
    },
    
    effects: {

      /**
       * 交易记录
       * @param {*} param0 
       * @param {*} param1 
       */
      *trans({payload},{call,put}) {
        try{
          if(payload.load){
            yield put({type:'updateLoadingState',payload:{transloading:true}});
          }
          const resp = yield call(Request.request,Api.trasactions,'post',{...payload});
          if(resp.code==0){
            yield put({type:'update',payload:{...payload,loading:false,data:resp.data}});
          }else{
            Toast.show(resp.msg);
            yield put({type:'updateLoadingState',payload:{transloading:false}});
          }
        }catch(e){
          Toast.show("网络异常，请稍后再试");
          yield put({type:'updateLoadingState',payload:{transloading:false}});
        } 
      },

      /**
       * 余额查询
       * @param {*} param0 
       * @param {*} param1 
       */
      *balance({payload,callback},{call,put}){
        try{
          const resp = yield call(Request.request,Api.balance,'post',{...payload});
          if(resp.code==0){
            //修改余额
            Globle.wallet.balance = resp.data.balance;
            //保存钱包信息
            yield call(store.save, 'wallet_info',Globle.wallet);
            yield put({type:'updateBalance',payload:{data:resp.data.balance}});
            if(callback){
              callback();
            }
          }else{
            Toast.show(resp.msg);
          }
        }catch(e){
          Toast.show("网络异常，请稍后再试");
        } 
      },
      /**
       * 检查账户
       * @param {*} param0 
       * @param {*} param1 
       */
      *checkAccount({payload,callback},{call,put}){
        try{
          const resp = yield call(Request.request,Api.checkAccount,'post',{...payload});
          callback(resp);
        }catch(e){
          Toast.show("网络异常，请稍后再试");
        } 
      },
      /**
       * 发送交易
       * @param {*} param0 
       * @param {*} param1 
       */
      *sendTransfer({payload,callback},{call,put}){
        try{
          const resp = yield call(Request.request,Api.transfer,'post',{...payload});
          callback(resp);
        }catch(e){
          Toast.show("网络异常，请稍后再试");
        } 
      },
      /**
       * 币种
       * @param {*} param0 
       * @param {*} param1 
       */
      *coins({payload,callback},{call,put}){
        try{
          const resp = yield call(Request.request,Api.purse_coins,'post',{});
          if(resp.code==0){
            Globle.purseCoins = resp.data;
            //保存登陆信息
            yield call(store.save, 'purse_coins',Globle.purseCoins);
            if(callback){
              callback();
            }
          }else{
            Toast.show(resp.msg);
          }
        }catch(e){
          Toast.show("网络异常，请稍后再试");
        } 
      },
      /**
       * 交易详情
       * @param {*} param0 
       * @param {*} param1 
       */
      *transaction({payload,callback},{call,put}){
        try{
          const resp = yield call(Request.request,Api.purse_tx,'post',{txid:payload.txid});
          if(resp.code==0){
            yield put({type:'updateTx',payload:{data:resp.data}});
          }else{
            Toast.show(resp.msg);
          }
        }catch(e){
          Toast.show("网络异常，请稍后再试");
        } 
      },
      /**
       * 清除交易信息
       * @param {*} param0 
       * @param {*} param1 
       */
      *clearTx({payload,callback},{call,put}){
        yield put({type:'updateClearTx',payload:{}});
      }
    },
    reducers: {
        updateLoadingState(state, action) {
          return {...state,...action.payload}
        },
        update(state, action) {
            if(action.payload.page==1){
              state.datas = action.payload.data;
            }else{
              state.datas = state.datas.concat(action.payload.data);
            }
            return {...state,transloading:action.payload.loading};
        },
        updateBalance(state, action) {
          return {...state,
              balance:action.payload.data
          };
        },
        updateTx(state, action) {
          return {...state,
              tx:action.payload.data
          };
        },
        updateClearTx(state, action) {
          return {...state,
              tx:null
          };
        },
    },
  }
  