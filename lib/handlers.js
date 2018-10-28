// TODO: Request handlers
// TODO: Define handlers
var handlers={};

// TODO: Handlers
handlers.getTodos=function(data,callback) {
callback(200,{'todo':"get Todos handlers"})
}

// TODO: 404 (Not found handler)
handlers.notFound=function(data,callback){
  callback(404)
}

module.exports=handlers;
 
