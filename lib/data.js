var fs=require('fs'),
path=require('path');

var lib={};

lib.baseDir=path.join(__dirname,'/../.data/');
// TODO: create and write data in file
 lib.create=function(dir,file,data,callback){
   fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDiscriptor){
     if (!err && fileDiscriptor) {
       var stringData=JSON.stringify(data);
       fs.writeFile(fileDiscriptor,stringData,function(err){
         if (!err) {
           callback(false);
         }else {
           callback('closeing ne file')
         }
       })
     }else {
       callback('file is already exits')
     }
   });
 }

// TODO: read data in file
lib.read=function(dir,file,callback){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
    callback(err,data)
  })
}

// TODO: update data in file
lib.update=function(dir,file,data,callback){
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDiscriptor){
    if (!err && fileDiscriptor) {
      var stringData=JSON.stringify(data);
      fs.truncate(fileDiscriptor,function(err){
        if (!err) {
          // TODO: write file
          fs.writeFile(fileDiscriptor,stringData,function(err){
            if (!err) {
              fs.close(fileDiscriptor,function(err){
                if (!err) {
                  callback(false)
                }else {
                  callback('Error closing file')
                }
              })
            }else {
              callback('Error writing file')
            }
          })
        }else {
          callback('Error truncatig file')
        }
      })
    }else {
      callback('could not open file, it may not exits')
    }
  })
}

// TODO: DELETE file
lib.delete=function (dir,file,callback) {
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
    if (!err) {
      callback(false)
    }else {
      callback('Error deleting file')
    }
  })
}

module.exports=lib;
