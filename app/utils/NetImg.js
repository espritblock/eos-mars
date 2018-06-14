import {Platform} from "react-native"

const small = (url) => {
  return url+"_150";
}

const big = (url) =>{
  return url+"_300";
}

const custom = (url,size) => {
    return url+"_"+size;
}

const im = (url) =>{
  if(Platform.OS=="ios"){
    return url;
  }else{
    return "file://"+url;
  }
}

export default {
  small,
  big,
  custom,
  im
};
