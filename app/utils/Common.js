import {
    Dimensions,
    PixelRatio,
} from 'react-native';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
let fontScale = PixelRatio.getFontScale();
let pixelRatio = PixelRatio.get();
const defaultPixel = 2;
const w2 = 375 / defaultPixel;
const h2 = 667 / defaultPixel;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);

const setSpText = (size) => {
    size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
    return size / defaultPixel;
}

const scaleSize = (size) =>{
    size = Math.round(size * scale + 0.5);
    return size / defaultPixel;
}

const numFormat = (num) =>{
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

const moneyFormat = (num) =>{
    if(num>=100000000){
        return (num/100000000).toFixed(2)+"亿";
    }else if(num>10000){
        return (num/10000).toFixed(2)+"万";
    }else{
        return num;
    }
}

export default {
    scaleSize,
    numFormat,
    moneyFormat
};
