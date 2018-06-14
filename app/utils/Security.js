var CryptoJS = require("crypto-js");

const encrypt = (content,password) => {
    var ciphertext = CryptoJS.AES.encrypt(content,password);
    return ciphertext.toString();
};

const decrypt = (content,password) => {
    var bytes  = CryptoJS.AES.decrypt(content,password);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
};

const encryptQr = (content) => {
    var ciphertext = CryptoJS.AES.encrypt(content,'54321%$#@!abcd');
    return ciphertext.toString();
};

const decryptQr = (content) => {
    var bytes  = CryptoJS.AES.decrypt(content,'54321%$#@!abcd');
    var plaintext = bytes.toString(CryptoJS.enc.Utf8); 
    return plaintext;
};

const parseSignParams = (params) =>{
    var keys = new Array();
    for(let item in params){ 
        keys.push(item);
    }
    keys.sort();
    let str="";
    keys.forEach((item,index)=>{
        str+=item+"="+params[item]+"&";
    })
    str = str.substr(0,str.length-1);
    return str;
}

const salt = () =>{
    var salt = CryptoJS.lib.WordArray.random(32);
    return salt;
}

const pbkdf2 = (password,salt) => {
    var key128Bits = CryptoJS.PBKDF2(password,salt,{keySize:32});
    return key128Bits.toString();
}

const md5 = (content)=> {
    var key = CryptoJS.MD5(content).toString();
    return key;
}

export default {
    encrypt,
    decrypt,
    encryptQr,
    decryptQr,
    parseSignParams,
    pbkdf2,
    salt,
    md5
};
