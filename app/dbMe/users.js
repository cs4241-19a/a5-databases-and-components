var fs = require("fs")

exports.findById = function(id, cb) {
  process.nextTick(function() {
    fs.readFile( 'database.json', function( err, content ) {
      var json_data = JSON.parse(content);
      for (var c in json_data){
        for(var user in json_data[c]) {
          for(var field in json_data[c][user]){
            if(field === "id"){
              if(json_data[c][user][field] == id){
                //console.log("username id found")
                return cb(null, json_data[c][user])
              }
            }
          }
        }
      }
      console.log("username id not found")
      return cb(null, null);
    })
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    fs.readFile( 'database.json', function( err, content ) {
      var json_data = JSON.parse(content);
      for (var c in json_data){
        for(var user in json_data[c]) {
          for(var field in json_data[c][user]){
            if(field === "username"){
              if(json_data[c][user][field] == username){
                //console.log("username found")
                return cb(null, json_data[c][user])
              }
            }
          }
        }
      }
      console.log("username not found")
      return cb(null, null);
    });
  });
}
