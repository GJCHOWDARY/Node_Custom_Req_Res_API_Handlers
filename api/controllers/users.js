var userHandlers={};

userHandlers.users = function(data,callback) {
 var allowMethods=['post','get','put','delete'];
 if (allowMethods.indexOf(data.method)> -1) {
   userHandlers._users[data.method](data,callback)
 }else {
   callback(405)
 }
 };

// TODO: handle the users methods
userHandlers._users={};

// TODO: post users
userHandlers._users.post=function(data,callback){

}
// TODO: update users
userHandlers._users.put=function(data,callback){

}
// TODO: get users
userHandlers._users.get=function(data,callback){

}
// TODO: delete users
userHandlers._users.delete=function(data,callback){

}
 userHandlers.getTodos = function(data,callback) {
 callback(200,{'data':'helloooo'})
  };
module.exports=userHandlers;
