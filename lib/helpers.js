// TODO: common helpers in app
var crypto=require('crypto'),
config=require('./config');

var helpers={};
// TODO: hash password
helpers.hash=function (str) {
  console.log(str,"oooo");
  if (typeof(str)=='string' && str.length>0) {
    var hash=crypto.createHmac('sha256',config.hashSecret).update(str).digest('hex');
     return hash;
  }else {
    return false;
  }
}

// TODO: parse JSON to Object
helpers.parseJsonToObject=function (data) {
    try {
      var obj=JSON.parse(data);
      return obj;
    } catch (e) {
      return {};
    }
}
// TODO: random stirng
helpers.createRandomString=function (strLength) {
  console.log(strLength,"llll");
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if (strLength) {
    console.log("oooooo");
    var acceptChar='abcdefghijklmnopqrstuvwxyz0987654321!@#$%^&*()~';
    var str='';
    for (var i = 0; i < strLength; i++) {
       var randomChar=acceptChar.charAt(Math.floor(Math.random()*acceptChar.length));
        str+=randomChar
     }
     return str;
  }else {
    console.log("kkkk");
    return false;
  }
}
module.exports=helpers;
