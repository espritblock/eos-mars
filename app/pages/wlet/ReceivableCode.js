import React from 'react';
import { connect } from 'react-redux';
import {TouchableWithoutFeedback,ScrollView,View,Text,TextInput,StyleSheet,Clipboard} from 'react-native';
import {Toast,Button} from '../../comps'
import {Colors,Security,Common} from '../../utils'
import Globle from '../../utils/Globle'
import I18n from '../../language/Ii8n';
import QRCode from 'react-native-qrcode-svg';
import { DataPicker } from 'rnkit-actionsheet-picker';
/**
 * ReceivableCode create by espritblock 
 */
@connect(({ identity }) => ({ ...identity }))
class ReceivableCode extends React.Component {

    static navigationOptions = {
        title:I18n.t("ReceivableCode.title")
    };
    
    state = {
        money: 1,
        coin:Globle.currentCoin,
        addressUrl:"mars://transfer/"+Security.encryptQr(JSON.stringify({
            account:Globle.wallet.name,
            ammount:1,
            coin:Globle.currentCoin.name,
            random:Math.floor(Math.random()*100000)
        }))
    }

    copyButtonClicked = () => {
        Clipboard.setString(Globle.wallet.address);
        Toast.show(I18n.t("common.copyaddress"));
    }

    moneyChange = (money) =>{
        if(money==""){
            money=1
        }
       this.resetQr(money);
    }

    resetQr = (money) =>{
        let params = {
            account:Globle.wallet.name,
            ammount:money,
            coin:this.state.coin.name,
            random:Math.floor(Math.random()*100000)
        }
        this.setState({money,addressUrl:"mars://transfer/"+Security.encryptQr(JSON.stringify(params))});
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
              this.resetQr(this.state.money);
            },
            onPickerCancel: () => {},
            onPickerDidSelect: (selectedData, selectedIndex) => {}
          });
    }

    render() {
        return(
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                <TouchableWithoutFeedback onPress={()=>this._input.blur()}>
                <View style={styles.content}>
                    <View style={styles.inputBack}>
                        <TextInput ref={(ref)=>this._input=ref} style={styles.moneyInput} maxLength={15} keyboardType="numeric" returnKeyType="next"  onChangeText={(money) => this.moneyChange(money)} selectionColor={Colors.mainColor} underlineColorAndroid="transparent" placeholder="1" placeholderTextColor="#999999" />
                        <Button style={styles.moneyTypeButton} onPress={()=>{
                            this.chooseCoin()
                        }}>
                            <Text style={styles.moneyTypeText}>{this.state.coin.name}</Text>
                        </Button>
                    </View>
                    <View style={styles.addressBack}>
                        <Text style={styles.address}>{Globle.wallet.name}</Text>
                    </View>
                    <View style={styles.code}>
                        <QRCode size={Common.scaleSize(181)} value={this.state.addressUrl}/>
                    </View>
                    <Button onPress={()=>{this.copyButtonClicked()}} style={{backgroundColor: '#f7f7f7',width:'100%',borderRadius:4,marginTop:Common.scaleSize(70)}}>
                        <View style={{padding:Common.scaleSize(12)}}>
                            <Text style={{color:'#333333',fontSize:Common.scaleSize(14),textAlign:'center',fontFamily:'PingFangSC-Regular'}}>{I18n.t("ReceivableCode.copyAddress")}</Text>
                        </View>
                    </Button>
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
    content: {
        flex: 1,
        marginLeft: Common.scaleSize(30),
        marginRight: Common.scaleSize(30),
        alignItems: 'center'
    },
    inputBack: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: Common.scaleSize(50),
        marginTop: Common.scaleSize(40),
        borderBottomColor: '#e5e5ee',
        borderBottomWidth: 0.3,
    },
    moneyInput: {
        flex: 1,
        fontSize: Common.scaleSize(25),
        color: '#adadbd',
        fontFamily: 'PingFangSC-Medium',
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
    addressBack: {
        alignItems: 'center',
    },
    address: {
       fontSize: Common.scaleSize(18),
       lineHeight: Common.scaleSize(30),
       fontFamily: 'PingFangSC-Regular',
       color: '#0b0817', 
       marginTop: Common.scaleSize(30),
    },
    code: {
        marginTop: Common.scaleSize(34),
    }
})
export default ReceivableCode;