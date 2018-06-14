import React from 'react';
import { connect } from 'react-redux';
import {TouchableWithoutFeedback,Platform,ScrollView,View,Text,TextInput,StyleSheet,Dimensions,DeviceEventEmitter} from 'react-native';
import {Dialog,Toast,Button,Loading,Auth,TextButton} from '../../comps'
import {Colors,Security,Common,Emiter} from '../../utils'
import Globle from '../../utils/Globle'
import I18n from '../../language/Ii8n';
import {Eos} from 'react-native-eosjs'
import {DataPicker } from 'rnkit-actionsheet-picker';
var submited = false;
var trAccount;

/**
 * Transfer create by espritblock 
 */
@connect(({ identity,wallet }) => ({ ...identity,...wallet }))
class Transfer extends React.Component {

    static navigationOptions = {
        title:I18n.t("Transfer.title")
    };

    state = {
        money: '1',
        address: '',
        remarks: '',
        password:"",
        balance:0,
        coin:Globle.currentCoin
    }

    clearBlur = () => {
        this._i1.blur();
        this._i2.blur();
        this._rmark.blur();
    }

    componentWillUnmount(){
        if(this.dotransfer){
            this.dotransfer.remove();
        }
    }

    nextButtonClicked = () => {
        this.clearBlur();
        if(this.state.money==""){
            Toast.show("请输入转账数量");
            return;
        }
        if(!/^\d+(?:\.\d{1,4})?$/.test(this.state.money)){
            Toast.show("输入错误，只能输入4位小数");
            return;
        }
        if(!Globle.wallet.balance){
            Toast.show("余额不足");
            return;
        }
        if(parseFloat(this.state.money)>Globle.wallet.balance){
            Toast.show("余额不足");
            return;
        }
        if(this.state.address==""){
            Toast.show("请输入对方账户");
            return;
        }
        Dialog.show("提示","确认给【"+this.state.address+"】账户转入"+this.state.money+"个【"+this.state.coin.name+"】吗？转账后无法追回，请确认信息是否正确","确认转账","取消",()=>{
            Dialog.dismis();
            DeviceEventEmitter.emit("dotransfer",{});
        },()=>{
            Dialog.dismis();
        });
    }

    checkResult = (res) =>{
        this.props.dispatch({type:'wallet/checkAccount',payload:{account:this.state.address},callback:(res)=>{
            if(res.code==0){
                if(res.data.exist){
                    trAccount = res.data;
                    this.doTransfor();
                }else{
                    Toast.show("账户不存在");
                }
            }else{
                Toast.show(res.msg);
            }
        }});
    }

    doTransfor = () =>{
        var th  = this;
        Auth.show(false,function(result){
            Auth.dismis();
            Loading.show("转账中");
            setTimeout(() => {th.trans(result)},500);
        });
    }

    trans = (result) => {
        var th = this;
        let c = this.state.coin;
        let pk = result;
        if(pk && pk.length>0){
            if(submited){
                return;
            }
            submited=true;
            let from = Globle.wallet.name;
            let to = th.state.address;
            let qua = th.state.money+" "+c.name;
            let memo = th.state.remarks;
            Eos.transfer(from,to,qua,memo,pk,false,(result)=>{
                if(!result.isSuccess){
                    Toast.show("转账失败");
                    this.resetTx();
                    return;
                }
                //请求参数签名
                let type = "transfer";
                let version = Security.md5(Security.salt());
                let tx = JSON.stringify(result.data);
                let p = {type,version,tx,from,to,memo,coin:c.name,qua:th.state.money}
                let data = Security.parseSignParams(p);
                Eos.sign(data,pk,(r)=>{
                    pk="";
                    if(r.isSuccess){
                        th.props.dispatch({type:'wallet/sendTransfer',payload:{sign:r.data,...p},callback:(res)=>{
                            Loading.dismis();
                            submited = false;
                            if(res.code==0){
                                Loading.dismis();
                                Toast.show("转账成功");
                                th.resetTx();
                                DeviceEventEmitter.emit(Emiter.im_transfer,{});
                            }else{
                                
                                th.resetTx();
                                Toast.show(res.msg);
                            }
                        }});
                    }else{
                        pk="";
                        this.resetTx();
                        Toast.show("转账失败");
                    }
                })
            });
        }else{
            this.resetTx();
            Toast.show("转账失败");
            pk="";
        }
    }

    resetTx = () =>{
        let c = this.state.coin;
        submited=false;
        Loading.dismis();
        this.setState({
            money: '1',
            address: '',
            remarks: '',
            password:"",
        });
        trAccount = null;
        //刷新余额
        setTimeout(() => {this.refreshBalance(c)}, 2000);
    }

    componentDidMount(){
        this.refreshBalance(this.state.coin);
        if(this.props.navigation.state.params.account){
            this.setState({
                address:this.props.navigation.state.params.account
            })
        }
        if(this.props.navigation.state.params.ammount){
            this.setState({
                money: this.props.navigation.state.params.ammount+""
            })
        }
        if(this.props.navigation.state.params.coin){
            let c = null;
            Globle.purseCoins.map((item)=>{
                if(item.name==this.props.navigation.state.params.coin){
                    c = item;
                }
            })
            if(c){
                this.setState({
                    coin: c
                });
                this.refreshBalance(c);
            }
        }

        this.dotransfer = DeviceEventEmitter.addListener("dotransfer",(e)=>{
            this.checkResult();
        })
    }

    refreshBalance = (c) =>{
        this.props.dispatch({type:'wallet/balance',payload:{account:Globle.wallet.name,pcid:c.id},callback:()=>{
            this.setState({
                balance:Globle.wallet.balance
            })
        }});
    }

    chooseCoin = () =>{
        let arr = new Array();
        Globle.purseCoins.map((item)=>{
            arr.push(item.name);
        })
        DataPicker.show({
            dataSource: arr,
            numberOfComponents: 1,
            onPickerConfirm: (selectedData, selectedIndex) => {
              Toast.show("已切换到"+Globle.purseCoins[selectedIndex].name);
              this.setState({coin:Globle.purseCoins[selectedIndex]});
              this.refreshBalance(Globle.purseCoins[selectedIndex]);
            },
            onPickerCancel: () => {},
            onPickerDidSelect: (selectedData, selectedIndex) => {}
          });
    }


    render() {
        return(
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                <TouchableWithoutFeedback onPress={()=>this.clearBlur()}>
                <View style={styles.content}>
                    <View style={styles.inputBack}>
                        <TextInput ref={(ref)=>this._i1=ref} defaultValue={this.state.money} style={styles.moneyInput} maxLength={12} keyboardType="numeric" returnKeyType="next" onSubmitEditing={() => this._money.focus()}  onChangeText={(money) => this.setState({money})} selectionColor={Colors.mainColor} underlineColorAndroid="transparent" placeholder="0" placeholderTextColor="#999999" />
                        <Text style={styles.moneySurplus}>余额:{this.state.balance}   </Text>
                        <Button style={styles.moneyTypeButton} onPress={()=>{
                            this.chooseCoin()
                        }}>
                            <Text style={styles.moneyTypeText}>{this.state.coin.name}</Text>
                        </Button>
                    </View>
                    <TextInput  ref={(ref)=>this._i2=ref} defaultValue={this.state.address} maxLength={12}  style={styles.addressInput} returnKeyType="next" autoCapitalize="none" keyboardType={Platform.OS=="ios"?"ascii-capable":"email-address"} onSubmitEditing={() => this._rmark.focus()}  onChangeText={(address) => this.setState({address:address.toLowerCase()})} selectionColor={Colors.mainColor} underlineColorAndroid="transparent" placeholder={I18n.t("Transfer.address")} placeholderTextColor="#999999" />
                    <TextInput ref={(ref)=>this._rmark=ref} style={styles.addressInput} returnKeyType="go" onSubmitEditing={() => this._remarks.focus()}  onChangeText={(remarks) => this.setState({remarks})} selectionColor={Colors.mainColor} underlineColorAndroid="transparent" placeholder={I18n.t("Transfer.remarks")} placeholderTextColor="#999999" />
                    <TextButton onPress={()=>{this.nextButtonClicked()}} bgColor={Colors.mainColor} textColor="#fff" text={I18n.t("Transfer.next")} style={{marginTop:Common.scaleSize(80)}} />
                </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
    },
    moneyTypeButton: {
        backgroundColor: Colors.mainColor,
        paddingLeft: Common.scaleSize(8),
        paddingRight: Common.scaleSize(8),
        paddingTop: Common.scaleSize(5),
        paddingBottom: Common.scaleSize(5),
        borderRadius: 4,
    },
    moneyTypeText: {
        fontSize: Common.scaleSize(12),
        color: '#FFFFFF',
        alignSelf: 'center',
    },
    content: {
        flex: 1,
        marginLeft: Common.scaleSize(25),
        marginRight: Common.scaleSize(25),
    },
    inputBack: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: Common.scaleSize(58),
        marginTop: Common.scaleSize(25),
        borderBottomColor: '#e5e5ee',
        borderBottomWidth: 0.5,
    },
    moneyInput: {
        flexWrap: 'wrap',
        flex: 1,
        fontSize: Common.scaleSize(20),
        color: '#666666',
        fontFamily: 'PingFangSC-Medium',
    },
    moneySurplus: {
        width: Common.scaleSize(150),
        textAlign: 'right',
        fontFamily: 'PingFangSC-Light',
        fontSize: Common.scaleSize(14),
        color: '#adadbd',
    },
    addressInput: {
        padding: 0,
        fontSize: Common.scaleSize(14),
        fontFamily: 'PingFangSC-Light',
        paddingBottom: Common.scaleSize(16),
        marginTop: Common.scaleSize(20),
        borderBottomColor: '#e5e5ee',
        borderBottomWidth: 0.5,
    }
})
export default Transfer;