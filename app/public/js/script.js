var USERNAME = ""
var PASSWORD = ""
var edit_data = {}
var fields = ["carbohydrates", "fruits", "vegetables", "protein", "oil"];

function returnHome(){
  setUsernameAndPassword()
  document.getElementById("VIEW_DATA").innerHTML = '\
            <div class="section" style="background-color:white; border-radius:20px; padding:13px"><div class="subtitle is-4" style="color:#2f2f2f">\
              <p>The purpose of this website is to allow WPI athletes to keep track of major food groups in their diet such as carbohydrates, proteins, vegetables, oils, and more. \
                A user can input data into the database and retrieve it at any time.</p>\
              <p>To edit your profile, select the View Profile button and make necessary changes to your username, password and display name. Note that you can only choose a username that hasnt already been taken.</p>\
              <p>Export this database by pressing the export data button in the navagation bar. This will download a JSON file of the database to your laptop for safe keeping. <p>\
              <p>To log out, press the log out button in the upper right. </p>\
              <p>Select a tab on the navigation panel under Data Tools to add, edit, or delete data. Check out the graphing tool for visualizing your diet habits under the View Data tab.</p> \
              <p>To add or remove a user, in the footer, there are two links to either add or remove a user. </p> \
            </div></div>'
}

function  deleteUsers(){
  var checkboxes = document.getElementsByName("REMOVE_USER_CHECKBOXES");
  var json_data = edit_data;
  var index_splice = -1;
  for (var i=0; i<checkboxes.length; i++) {
    var index = 0;
    if(checkboxes[i].checked){
      for (var c in json_data){
        for(var user in json_data[c]) {
          console.log(json_data[c][user]["username"])
          if(json_data[c][user]["username"] === checkboxes[i].id){
            index_splice = index;
          }
          index += 1;
        }
      }
    }
    if (index_splice >= 0){
      json_data["users"].splice(index_splice, 1)
    }
  }

  var myRequest = new Request('/updateUser', {
      method: 'POST', 
      body: JSON.stringify({ username:USERNAME, password:PASSWORD, data:json_data}), 
      headers: { 'Content-Type': 'application/json' }
  });

  fetch(myRequest).then(
    function(response) {
    response.text().then(function(info) {
      document.getElementById("VIEW_DATA").innerHTML = "Successfully Deleted Selected Users";
    });
  });
}

function removeUser(){
  setUsernameAndPassword()
  
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(json_data) {
      edit_data = json_data
      var output = '<div class="section" style="background-color:white; border-radius:20px; padding:13px"><h1> Delete Users </h1>'
      for (var c in json_data){
        for(var user in json_data[c]) {
          if(json_data[c][user]["username"] !== USERNAME){
            output += '<div class="column" style="margin: 0px 0px 10px 0px"><input type="checkbox" id="' + json_data[c][user]["username"] + '" name="REMOVE_USER_CHECKBOXES"> Display Name: ' + json_data[c][user]["displayName"] +  ' &nbsp; &nbsp;Username: ' + json_data[c][user]["username"] +  '</div>' 
          }
        }
      }
      output += '<button class="button" style="margin:10px 20px" id="SUBMIT_EDITS" onclick="deleteUsers()">Delete Selected Users</button></div>'
      document.getElementById("VIEW_DATA").innerHTML = output
    });
   });

}


function submitNewUser(){
  setUsernameAndPassword()
  
  var new_username = document.getElementById("NEW_USERNAME").value
  var new_password = document.getElementById("NEW_PASSWORD").value
  var new_display_name = document.getElementById("NEW_DISPLAYNAME").value
  
  if(new_username === "" ){document.getElementById("NEW_USERNAME").placeholder = "INCLUDE USERNAME" }
  if(new_password === "" ){
    document.getElementById("NEW_PASSWORD").placeholder = "INCLUDE PASSWORD"
  }
  if(new_display_name === ""){
    document.getElementById("NEW_DISPLAYNAME").placeholder = "INCLUDE DISPLAY NAME"
  }
  if(new_username === "" | new_password === "" | new_display_name === ""){
    return addNewUser("retry")
  }
  
  let json_data
  var max_user = 0;
  var user_exists = false;

  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(data) {
      json_data = data
      for (var c in json_data){
        for(var user in json_data[c]) {
          max_user = user
          for(var field in json_data[c][user]){
            if(field === "username"){
              if(json_data[c][user][field] === new_username){
                user_exists = true;
              }
            }
          }
        }
      }
      max_user = parseInt(max_user, 10) + 2;
      if (user_exists === false){
        
        var new_user = {"id":max_user, "username": new_username, "password": new_password, "displayName": new_display_name, "data": {}}
        json_data['users'].push(new_user)
        
        var newRequest = new Request('/updateUser', {
          method: 'POST', 
          body: JSON.stringify({ username:USERNAME, password:PASSWORD, data:json_data}), 
          headers: { 'Content-Type': 'application/json' }
        });

        fetch(newRequest).then(
          function(response) {
          response.text().then(function(info) {
            document.getElementById("VIEW_DATA").innerHTML = "Profile has been Added"  
            });
          });
      }
      else{
        document.getElementById("VIEW_DATA").innerHTML = "Username already exists"  
      }
    });
  });
}

function addNewUser(text){
  setUsernameAndPassword()
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(json_data) {
      var output = '<div class="section" style="background-color:white; border-radius:20px; padding:13px"><h1>User Profile</h1>'
      for (var c in json_data){
        for(var user in json_data[c]) {
          for(var field in json_data[c][user]){
            if(field === "username"){
              if(json_data[c][user][field] === USERNAME){
                output += '<div class=columns>'
                output += '<div class="column has-text-right is-one-quarter">Username: </div><div class="column"><input class="input is-medium" type="text" id="NEW_USERNAME" placeholder="Add username" style="width:80%"></div><div class=column></div><br>'
                output += '</div>'
                output += '<div class=columns>'
                output += '<div class="column has-text-right is-one-quarter">Password: </div><div class="column"><input class="input is-medium" type="text" id="NEW_PASSWORD" placeholder="Add password" style="width:80%"></div><div class=column></div><br>'
                output += '</div>'
                output += '<div class=columns>'
                output += '<div class="column has-text-right is-one-quarter">Display Name: </div><div class="column"><input class="input is-medium" type="text" id="NEW_DISPLAYNAME" placeholder="Add display name" style="width:80%"></div><div class=column></div><br>'
                output += '</div>'
                output += '<button class="button" style="margin:10px 20px" onclick="submitNewUser()">Submit New User</button>'
              }
            }
          }
        }
      }
      if(text !== "retry"){
        document.getElementById("VIEW_DATA").innerHTML = output
      }
    });
   });
}

function submitProfile(){
  setUsernameAndPassword()
  
  var new_username = document.getElementById("NEW_USERNAME").value
  var new_password = document.getElementById("NEW_PASSWORD").value
  var new_display_name = document.getElementById("NEW_DISPLAYNAME").value
  
  if(new_username === "" ){document.getElementById("NEW_USERNAME").placeholder = "INCLUDE USERNAME" }
  if(new_password === "" ){
    document.getElementById("NEW_PASSWORD").placeholder = "INCLUDE PASSWORD"
  }
  if(new_display_name === ""){
    document.getElementById("NEW_DISPLAYNAME").placeholder = "INCLUDE DISPLAY NAME"
  }
  if(new_username === "" | new_password === "" | new_display_name === ""){
    return editProfile("retry")
  }
  
  let json_data
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(data) {
      json_data = data
      
      var user_exists = false;
      for (var c in json_data){
        for(var user in json_data[c]) {
          for(var field in json_data[c][user]){
            if(field === "username"){
              if(json_data[c][user][field] === new_username && new_username !== USERNAME){
                user_exists = true;
              }
            }
          }
        }
      }
      if(user_exists === false){
        for (var c in json_data){
          for(var user in json_data[c]) {
            for(var field in json_data[c][user]){
              if(field === "username"){
                if(json_data[c][user][field] === USERNAME){
                  json_data[c][user]['username'] = new_username
                  json_data[c][user]['password']  = new_password
                  json_data[c][user]['displayName'] = new_display_name           

                    var newRequest = new Request('/updateUser', {
                      method: 'POST', 
                      body: JSON.stringify({ username:USERNAME, password:PASSWORD, data:json_data}), 
                      headers: { 'Content-Type': 'application/json' }
                    });

                    fetch(newRequest).then(
                      function(response) {
                      response.text().then(function(info) {
                        document.getElementById("VIEW_DATA").innerHTML = "Profile has been Changed"  

                        USERNAME = new_username
                        document.getElementById("VIEW_DATA").value = new_username
                        document.getElementById("WELCOME_NAME").innerHTML = "Welcome: " + new_display_name

                        PASSWORD = new_password
                        document.getElementById("VIEW_DATA").name = new_password
                      });
                    });
                }
              }
            }
          }
        }
      }
      else{
        document.getElementById("VIEW_DATA").innerHTML = "Username already exists" 
      }
    });
   });
    
}

function editProfile(text){
  setUsernameAndPassword()
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(json_data) {
      var output = '<div class="section" style="background-color:white; border-radius:20px; padding:13px"><h1>User Profile</h1>'
      for (var c in json_data){
        for(var user in json_data[c]) {
          for(var field in json_data[c][user]){
            if(field === "username"){
              if(json_data[c][user][field] === USERNAME){
                output += '<div class=columns>'
                output += '<div class="column has-text-right is-one-quarter">Username: </div><div class="column"><input class="input is-medium" type="text" id="NEW_USERNAME" placeholder='+ json_data[c][user]['username'] +' style="width:80%"></div><div class=column></div><br>'
                output += '</div>'
                output += '<div class=columns>'
                output += '<div class="column has-text-right is-one-quarter">Password: </div><div class="column"><input class="input is-medium" type="text" id="NEW_PASSWORD" placeholder='+ json_data[c][user]['password'] +' style="width:80%"></div><div class=column></div><br>'
                output += '</div>'
                output += '<div class=columns>'
                output += '<div class="column has-text-right is-one-quarter">Display Name: </div><div class="column"><input class="input is-medium" type="text" id="NEW_DISPLAYNAME" placeholder='+ json_data[c][user]['displayName'] +' style="width:80%"></div><div class=column></div><br>'
                output += '</div>'
                output += '<button class="button" style="margin:10px 20px" onclick="submitProfile()">Submit Profile</button>'
              }
            }
          }
        }
      }
      if(text !== "retry"){
        document.getElementById("VIEW_DATA").innerHTML = output
      }
    });
   });
}


function viewProfile(){
  setUsernameAndPassword()
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(json_data) {
      var output = '<div class="section" style="background-color:white; border-radius:20px; padding:13px"><h1>User Profile</h1>'
      for (var c in json_data){
        for(var user in json_data[c]) {
          for(var field in json_data[c][user]){
            if(field === "username"){
              if(json_data[c][user][field] === USERNAME){
                output += '<div class=columns>'
                output += '<div class="column has-text-right is-one-quarter">Username: </div><div class="column has-text-left is-one-fifth">'+ json_data[c][user]['username'] + '</div><div class=column></div>'
                output += '</div>'
                output += '<div class=columns>'
                output += '<div class="column has-text-right is-one-quarter">Password: </div><div class="column has-text-left is-one-fifth">'+ json_data[c][user]['password'] + '</div><div class=column></div>'
                output += '</div>'
                output += '<div class=columns>'
                output += '<div class="column has-text-right is-one-quarter">Display Name: </div><div class="column has-text-left is-one-fifth">'+ json_data[c][user]['displayName'] + '</div><div class=column></div>'
                output += '</div>'
                output += '<button class="button" style="margin:10px 20px" onclick="editProfile(\'none\')">Edit Profile</button>'
                document.getElementById("VIEW_DATA").innerHTML = output
              }
            }
          }
        }
      }
    });
   });
}

function addEntry(){
  var new_date = document.getElementById("NEW_DATE").value;
  var checkboxes = document.getElementsByName("NEW_DATA_CHECKBOXES");
  var json_data = edit_data;
  
  for (var c in json_data){
    for(var user in json_data[c]) {
      for(var field in json_data[c][user]){
        if(field === "username"){
          if(json_data[c][user][field] === USERNAME){
            
            json_data[c][user]["data"][new_date] = {}
            
            for (var i=0; i<checkboxes.length; i++) {
              if(checkboxes[i].checked){
                json_data[c][user]["data"][new_date][checkboxes[i].id] = "true"
              }
              else{
                json_data[c][user]["data"][new_date][checkboxes[i].id] = "false"
              }
            }
            
            var myRequest = new Request('/updateUser', {
                method: 'POST', 
                body: JSON.stringify({ username:USERNAME, password:PASSWORD, data:json_data}), 
                headers: { 'Content-Type': 'application/json' }
            });

            fetch(myRequest).then(
              function(response) {
              response.text().then(function(info) {
                document.getElementById("VIEW_DATA").innerHTML = info;
              });
            });
            
          }
        }
      }
    }
  }
}


function setupAddData(){
  setUsernameAndPassword()
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(json_data) {
      var output = '<div class="section" style="background-color:white; border-radius:20px; padding:13px"><h1> Add Entry </h1>'
      output += '<input class="input is-large" type="text" id="NEW_DATE" placeholder="New Date (month/day)" style="margin: 10px 20px; width:75%">'
      
      for(var i = 0; i < fields.length; i++){
        output += '<p class="subtitle is-5" style="padding: 5px 20px; margin: 0px 0px 0px 0px; color:black"><input type="checkbox" id="' + fields[i] + '" name="NEW_DATA_CHECKBOXES"> '+ fields[i] + '</p>';  
      }
      
      edit_data = json_data;
      output += '<button class="button" style="margin:10px 20px" id="SUBMIT_EDITS" onclick="addEntry()">Submit New Entry</button></div>';
      document.getElementById("VIEW_DATA").innerHTML = output
    });
   });
}




function submitEdits(){
  var checkboxes = document.getElementsByName("USER_EDIT_CHECKBOXES");
  var json_data = edit_data;
  
  for (var c in json_data){
    for(var user in json_data[c]) {
      for(var field in json_data[c][user]){
        if(field === "username"){
          if(json_data[c][user][field] === USERNAME){
            for (var date in json_data[c][user]["data"]){
                for (var i=0; i<checkboxes.length; i++) {
                  if(checkboxes[i].value === date){
                    if(checkboxes[i].checked){
                      json_data[c][user]["data"][date][checkboxes[i].id] = "true"
                    }
                    else{
                      json_data[c][user]["data"][date][checkboxes[i].id] = "false"
                    }
                  }
                }
            }
            
            var myRequest = new Request('/updateUser', {
                method: 'POST', 
                body: JSON.stringify({ username:USERNAME, password:PASSWORD, data:json_data}), 
                headers: { 'Content-Type': 'application/json' }
            });

            fetch(myRequest).then(
              function(response) {
              response.text().then(function(info) {
                document.getElementById("VIEW_DATA").innerHTML = info;
              });
            });
            
            
            
          }
        }
      }
    }
  }
}

function setupEditData(){
  setUsernameAndPassword()
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(json_data) {
      var output = '<div class="section" style="background-color:white; border-radius:20px; padding:13px"><h1> Edit Entry </h1>'
      for (var c in json_data){
        for(var user in json_data[c]) {
          var thisUsername = false;
          for(var field in json_data[c][user]){
            if(field === "username"){
              if(json_data[c][user][field] === USERNAME){
                thisUsername = true;
              }
              else{
                thisUsername = false;
              }
            }
          }
          for(var field in json_data[c][user]){
            if(field === "data" && thisUsername){
              for (var date in json_data[c][user][field]){
                output += '<h4 style="padding: 5px 0px; margin: 0px 0px 0px 0px">'+date+"</h4>"
                for (var user_info_field in json_data[c][user][field][date]){
                  if (user_info_field !== "score"){
                    if (json_data[c][user][field][date][user_info_field] === "true"){
                      output += '<p class="subtitle is-5" style="padding: 0px 20px; margin: 0px 0px 0px 0px; color:green"><input type="checkbox" id="' + user_info_field + '" name="USER_EDIT_CHECKBOXES" value="'+date+'" checked> '+ user_info_field + '</p>';
                    }
                    else{
                      output += '<p class="subtitle is-5" style="padding: 0px 20px; margin: 0px 0px 0px 0px; color:red"><input type="checkbox" id="' + user_info_field + '" name="USER_EDIT_CHECKBOXES" value="'+date+'"> '+ user_info_field + '</p>'; 
                    }
                  }
                }
              }
            }
          }
        }
      }
      edit_data = json_data;
      output += '<button class="button" style="margin:10px 20px" id="SUBMIT_EDITS" onclick="submitEdits()">Submit Edits</button></div>';
      document.getElementById("VIEW_DATA").innerHTML = output
    });
   });
}

function submitDeletes(){
  var checkboxes = document.getElementsByName("USER_DELETE_CHECKBOXES");

  var json_data = edit_data;
  
  for (var c in json_data){
    for(var user in json_data[c]) {
      for(var field in json_data[c][user]){
        if(field === "username"){
          if(json_data[c][user][field] === USERNAME){
            for (var i=0; i<checkboxes.length; i++) {
              if(checkboxes[i].checked){
                delete json_data[c][user]["data"][checkboxes[i].id]
              }
            }
            var myRequest = new Request('/updateUser', {
                method: 'POST', 
                body: JSON.stringify({ username:USERNAME, password:PASSWORD, data:json_data}), 
                headers: { 'Content-Type': 'application/json' }
            });
            
            fetch(myRequest).then(
              function(response) {
              response.text().then(function(info) {
                document.getElementById("VIEW_DATA").innerHTML = info;
              });
            });
          }
        }
      }
    }
  }
}


function setupDeleteData(){
  setUsernameAndPassword()
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(json_data) {
      var output = '<div class="section" style="background-color:white; border-radius:20px; padding:13px"><h1> Delete Entry </h1>'
      for (var c in json_data){
        for(var user in json_data[c]) {
          var thisUsername = false;
          for(var field in json_data[c][user]){
            if(field === "username"){
              if(json_data[c][user][field] === USERNAME){
                thisUsername = true;
              }
              else{
                thisUsername = false;
              }
            }
          }
          for(var field in json_data[c][user]){
            if(field === "data" && thisUsername){
              for (var date in json_data[c][user][field]){
                output += '<h4 style="padding: 5px 0px; margin: 0px 0px 0px 0px"><input type="checkbox" id="' + date + '" name="USER_DELETE_CHECKBOXES"> '+date+"</h4>"
                for (var user_info_field in json_data[c][user][field][date]){
                  if (user_info_field !== "score"){
                    if (json_data[c][user][field][date][user_info_field] === "true"){
                      output += '<p class="subtitle is-5" style="padding: 0px 20px; margin: 0px 0px 0px 0px; color:green">'+ user_info_field + '</p>';
                    }
                    else{
                      output += '<p class="subtitle is-5" style="padding: 0px 20px; margin: 0px 0px 0px 0px; color:red">'+ user_info_field + '</p>'; 
                    }
                  }
                }
              }
            }
          }
        }
      }
      edit_data = json_data;
      output += '<button class="button" style="margin:10px 20px" id="SUBMIT_EDITS" onclick="submitDeletes()">Submit Dates To Delete</button></div>';
      document.getElementById("VIEW_DATA").innerHTML = output
    });
   });
}

function viewUserData(){
  setUsernameAndPassword()
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(json_data) {
      var output = '<div class="section" style="background-color:white; border-radius:20px; padding:13px"><h1> User Info </h1>'
      for (var c in json_data){
        for(var user in json_data[c]) {
          var thisUsername = false;
          for(var field in json_data[c][user]){
            if(field === "username"){
              if(json_data[c][user][field] === USERNAME){
                thisUsername = true;
              }
              else{
                thisUsername = false;
              }
            }
          }
          for(var field in json_data[c][user]){
            if(field === "data" && thisUsername){
              for (var date in json_data[c][user][field]){
                output += '<h4 style="padding: 5px 0px; margin: 0px 0px 0px 0px">'+date+"</h4>"
                for (var user_info_field in json_data[c][user][field][date]){
                  if (user_info_field !== "score"){
                    if (json_data[c][user][field][date][user_info_field] === "true"){
                      output += '<p class="subtitle is-5" style="padding: 0px 20px; margin: 0px 0px 0px 0px; color:green">'+ user_info_field + '</p>';
                    }
                    else{
                      output += '<p class="subtitle is-5" style="padding: 0px 20px; margin: 0px 0px 0px 0px; color:red">'+ user_info_field + '</p>'; 
                    }
                  }
                  else{
                    output += '<p style="color:black; padding: 0px 10px;">Score: '+ json_data[c][user][field][date][user_info_field] + '</p><br>'; 
                  }
                }
              }
            }
          }
        }
      }
      output += "</div>"
      document.getElementById("VIEW_DATA").innerHTML = output
    });
   });
}

function viewAllData(){
  setUsernameAndPassword()
  let myRequest = new Request('/getDatabase', { method:'GET'} );
  fetch(myRequest).then(function(response) {
    response.json().then(function(json_data) {
      var output = '<div class="section" style="background-color:white; border-radius:20px; padding:13px"><h1> All User Info </h1>'
      for (var c in json_data){
        for(var user in json_data[c]) {
          output += '<h3 style="margin: 0px 0px 10px 0px">' + json_data[c][user]["displayName"] + '</h3>'
          for(var field in json_data[c][user]){
            if(field === "data"){
              for (var date in json_data[c][user][field]){
                output += '<h4 style="padding: 0px 20px; margin: 0px 0px 0px 0px">'+date+"</h4>"
                for (var user_info_field in json_data[c][user][field][date]){
                  if (user_info_field !== "score"){
                    if (json_data[c][user][field][date][user_info_field] === "true"){
                      output += '<p class="subtitle is-5" style="padding: 0px 40px; margin: 0px 0px 0px 0px; color:green">'+ user_info_field + '</p>';
                    }
                    else{
                      output += '<p class="subtitle is-5" style="padding: 0px 40px; margin: 0px 0px 0px 0px; color:red">'+ user_info_field + '</p>'; 
                    }
                  }
                  else{
                    output += '<p style="color:black; padding: 0px 30px;">Score: '+ json_data[c][user][field][date][user_info_field] + '</p><br>'; 
                  }
                }
              }
            }
          }
        }
      }
      output += "</div>"
      document.getElementById("VIEW_DATA").innerHTML = output
    });
   });
}

function loginUser(){
  setUsernameAndPasswordFromLogin()
  var myRequest = new Request('/login_a_user', {
      method: 'POST', 
      body: JSON.stringify({ username:USERNAME, password:PASSWORD}), 
      headers: { 'Content-Type': 'application/json' }
  });
  fetch(myRequest).then( 
    function(res){
      return res.json() 
    }).then( function(){ 
      window.location.pathname = '/'
    }
  );
}
  
function setUsernameAndPasswordFromLogin(){
  USERNAME = document.getElementById("LOGIN_USERNAME").value;
  PASSWORD = document.getElementById("LOGIN_PASSWORD").value;
}

function setUsernameAndPassword(){
  USERNAME = document.getElementById("VIEW_DATA").value;
  PASSWORD = document.getElementById("VIEW_DATA").name;
}
