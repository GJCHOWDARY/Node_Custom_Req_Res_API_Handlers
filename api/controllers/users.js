var helpers=require('../../lib/helpers'),
_data=require('../../lib/data');


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
  console.log(data.payload);
var name=typeof(data.payload.name)=='string' &&data.payload.name.trim().length>0?data.payload.name.trim():false;
var mobile = typeof(data.payload.mobile) == 'string' && data.payload.mobile.trim().length == 10 ? data.payload.mobile.trim() : false;
var email=typeof(data.payload.email)=='string' &&data.payload.email.trim().length>0?data.payload.email.trim():false;
var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
// console.log(name,mobile,email,password);
_data.read('users',mobile,function (err,data) {
  if (err) {
    console.log(password,"llll");
     var hashPassword=helpers.hash(password);
     console.log(hashPassword,password);
    if(hashPassword) {
    var user={
      'name':name,
      'mobile':mobile,
      'email':email,
      'password':hashPassword,
      'status':'Inactive'
    }
    console.log(user);
    _data.create('users',mobile,user,function (err) {
      if (!err) {
        callback(200)
      }else {
        callback(500,{'Error':'Could not create User'})
      }
    })
  }else {
    callback(400,{'Error':'Userrrr Already Exits'})
  }
}else {
  callback(500,{'Error':'Could not create user password, please try agin'})
}
})
}

// TODO: get users
userHandlers._users.get=function(data,callback){
  var mobile=typeof(data.query.mobile)=='string'&&data.query.mobile.trim().length==10?data.query.mobile.trim():false;
  if (mobile) {
  _data.read('users',mobile,function (err,data) {
    if (!err && data) {
      delete data.password;
      callback(200,data);
    }else {
      callback(404)
    }
  })
}else {
  callback(400,{'Error':'Wrong Mobile Number'})
}
}

// TODO: update users
userHandlers._users.put=function(data,callback){
  var mobile=typeof(data.query.mobile)=='string'&&data.query.mobile.trim().length==10?data.query.mobile.trim():false;
  var email=typeof(data.query.email)=='string' &&data.query.email.trim().length>0?data.query.email.trim():false;
  var name=typeof(data.query.name)=='string' &&data.query.name.trim().length>0?data.query.name.trim():false;
  var password=typeof(data.query.password)=='string' &&data.query.password.trim().length>0?data.query.password.trim():false;
 if (mobile) {
 if (email||name||password) {
   _data.read('users',mobile,function (err,userData) {
     if (!err&&userData) {
       if (name) {
         userData.name=name;
       }
       if (password) {
            userData.password=helpers.hash(password);
       }
       _data.update('users',mobile,userData,function (err) {
         if (!err) {
           callback(200)
         }else {
           callback(500,{'Error':'Could not update user'})
         }
       })
     }else {
       callback(400,{'Error':'User does not exits'})
     }
   })
 }else {
   callback(400,{'Error':'Missing required fields to update'})
 }
}else {
  callback(400,{'Error':'Missing required information'})
}
}
// TODO: delete users
userHandlers._users.delete=function(data,callback){
    var mobile=typeof(data.query.mobile)=='string'&&data.query.mobile.trim().length==10?data.query.mobile.trim():false;
    if (mobile) {
       _data.read('users',mobile,function (err,userData) {
         if (!err&&userData) {
           _data.delete('users',mobile,function (err) {
             if (!err) {
               callback(200)
             }else {
               callback(400,{'Error':'Could not delete specified user'})
             }
           });
          }else {
            callback(400,{'Error':'could find the specified user'})
          }
    });
  }else {
    callback(400,{'Error':'Missing required fields'})
  }
  }


  // Tokens
  userHandlers.tokens = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
      userHandlers._tokens[data.method](data,callback);
    } else {
      callback(405);
    }
  };

  // Container for all the tokens methods
  userHandlers._tokens  = {};

  // Tokens - post
  // Required data: phone, password
  // Optional data: none
  userHandlers._tokens.post = function(data,callback){
    var mobile = typeof(data.payload.mobile) == 'string' && data.payload.mobile.trim().length == 10 ? data.payload.mobile.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if(mobile && password){
      // Lookup the user who matches that phone number
      _data.read('users',mobile,function(err,userData){
        if(!err && userData){
          // Hash the sent password, and compare it to the password stored in the user object
          var hashedPassword = helpers.hash(password);
          if(hashedPassword == userData.password){
            // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
            var tokenId = helpers.createRandomString(20);
            var expires = Date.now() + 1000 * 60 * 60;
            var tokenObject = {
              'mobile' : mobile,
              'id' : tokenId,
              'expires' : expires
            };

            // Store the token
            _data.create('tokens',tokenId,tokenObject,function(err){
              if(!err){
                callback(200,tokenObject);
              } else {
                callback(500,{'Error' : 'Could not create the new token'});
              }
            });
          } else {
            callback(400,{'Error' : 'Password did not match the specified user\'s stored password'});
          }
        } else {
          callback(400,{'Error' : 'Could not find the specified user.'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field(s).'})
    }
  };

  // Tokens - get
  // Required data: id
  // Optional data: none
  userHandlers._tokens.get = function(data,callback){
    // Check that id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
      // Lookup the token
      _data.read('tokens',id,function(err,tokenData){
        if(!err && tokenData){
          callback(200,tokenData);
        } else {
          callback(404);
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field, or field invalid'})
    }
  };

  // Tokens - put
  // Required data: id, extend
  // Optional data: none
  userHandlers._tokens.put = function(data,callback){
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if(id && extend){
      // Lookup the existing token
      _data.read('tokens',id,function(err,tokenData){
        if(!err && tokenData){
          // Check to make sure the token isn't already expired
          if(tokenData.expires > Date.now()){
            // Set the expiration an hour from now
            tokenData.expires = Date.now() + 1000 * 60 * 60;
            // Store the new updates
            _data.update('tokens',id,tokenData,function(err){
              if(!err){
                callback(200);
              } else {
                callback(500,{'Error' : 'Could not update the token\'s expiration.'});
              }
            });
          } else {
            callback(400,{"Error" : "The token has already expired, and cannot be extended."});
          }
        } else {
          callback(400,{'Error' : 'Specified user does not exist.'});
        }
      });
    } else {
      callback(400,{"Error": "Missing required field(s) or field(s) are invalid."});
    }
  };


  // Tokens - delete
  // Required data: id
  // Optional data: none
  userHandlers._tokens.delete = function(data,callback){
    // Check that id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
      // Lookup the token
      _data.read('tokens',id,function(err,tokenData){
        if(!err && tokenData){
          // Delete the token
          _data.delete('tokens',id,function(err){
            if(!err){
              callback(200);
            } else {
              callback(500,{'Error' : 'Could not delete the specified token'});
            }
          });
        } else {
          callback(400,{'Error' : 'Could not find the specified token.'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field'})
    }
  };

  // Verify if a given token id is currently valid for a given user
  userHandlers._tokens.verifyToken = function(id,mobile,callback){
    // Lookup the token
    _data.read('tokens',id,function(err,tokenData){
      if(!err && tokenData){
        // Check that the token is for the given user and has not expired
        if(tokenData.mobile == mobile && tokenData.expires > Date.now()){
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  };

// TODO: test api
 userHandlers.getTodos = function(data,callback) {
 callback(200,{'data':'helloooo'})
  };
module.exports=userHandlers;
