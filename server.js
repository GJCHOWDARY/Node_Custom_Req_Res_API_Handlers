// TODO:  Dependencies
var http=require('http'),
https=require('https'),
path = require('path'),
url=require('url'),
fs=require('fs'),
config=require('./lib/config'),
handlers=require('./lib/handlers'),
helpers=require('./lib/helpers'),
StringDecoder=require('string_decoder').StringDecoder,
_data=require('./lib/data');

// TODO: read and write file
// _data.create('test','newFile',{'foo':'bar'},function (err) {
//   console.log(err);
// })
// _data.read('test','newFile',function (err,data) {
//   console.log(err,data);
// })
// _data.update('test','newFile',{'JJJ':'DDDDDD'},function (err) {
//   console.log(err);
// })
// _data.delete('test','newFile',function (err) {
//   console.log(err);
// })
var controllers = require(path.resolve('api')).controllers,
dealsController = controllers.dealsController,
usersController = controllers.searchController;

// server.get('/getTodos', searchController.getTodos);
// TODO: create server
var httpServer=http.createServer(function(req,res){
  unifiedServer(req,res);
});
// TODO: Listening server on port
httpServer.listen(config.httpPort,function(){
  console.log("server listening on http://localhost:"+config.httpPort);
});

// TODO: ssl files
var options={
  'key':fs.readFileSync('./https/key.pem') ,
  'cert':fs.readFileSync('./https/cert.pem')
}
var httpsServer=https.createServer(options,function(req,res){
  unifiedServer(req,res);
});
httpsServer.listen(config.httpsPort,function(){
  console.log("server listening on http://localhost:"+config.httpsPort);
});
// TODO: create server http/https
var unifiedServer=function(req,res) {
  var parsedUrl=url.parse(req.url,true);
  var path=parsedUrl.pathname;
  var trimPath=path.replace(/^\/+|\/+$/g,'');
  var method=req.method.toLowerCase();
  var queryStrings=parsedUrl.query;
  var reqHeaders=req.headers;
  var decoder=new StringDecoder('utf-8');
  var buffer='';
  req.on('data',function(data){
  buffer+=decoder.write(data);
  })
  req.on('end',function(){
  buffer+=decoder.end();

  var chosenHandler=typeof(router[trimPath])!=='undefined'?router[trimPath]:handlers.notFound;

  // TODO: Construct data object to send to handler
   var data={'path':trimPath,
            'query':queryStrings,
            'method':method,
            'headers':reqHeaders,
            'payload':helpers.parseJsonToObject(buffer)
              }
       chosenHandler(data,function(statusCode,payload){
        statusCode=typeof(statusCode)== 'number'?statusCode:200;
        payload=typeof(payload)=='object'?payload:{};
        var payloadString=JSON.stringify(payload);
        res.setHeader('Content-type','application/json')
        res.writeHead(statusCode);
        res.end(payloadString)
      // console.log(trimPath,method,reqHeaders,queryStrings,buffer,statusCode,payload,"fooo");
    });
  });
}
// TODO: Define request Routers

var router={
  'gettodos':handlers.getTodos,
  'getUsers':usersController.users,
  'tokens' : usersController.tokens
}
