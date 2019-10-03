const login = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const username = document.querySelector( '#username' ),
          password = document.querySelector( '#password' ),
          json = { username: username.value, 
                   password: password.value,
                  },
          body = JSON.stringify( json )

    if(username.value === '' || password.value === ''){
      document.getElementById("error1").style.display = "block";
      return false;
    }

    console.log(body)
    fetch( '/login', {
        method:'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' }
      }).then(function(response) {
          if(response.status == 401){
              console.log('unauthorized');
              document.getElementById("error1").style.display = "block";
              return false;
          } else {
            console.log(response);
            let json = response.json();
            window.location = '/'
          }
      })


    return false
  }

  const create = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

        var fname = document.querySelector("#firstname").value;
    var lname = document.querySelector("#lastname").value;
    var color = document.querySelector("#favcolor").value;
    var birthday = document.querySelector("#birthday").value;
    var mood = document.querySelector(".mood input[type='radio']:checked");
    if(mood === null){
      mood = "";
    }else{
      mood = mood.value;
    }

    var error = errorValidation(fname, lname, color, birthday, mood);
    
    const username = document.querySelector( '#newusername' ),
          password = document.querySelector( '#newpassword' ),
          json = { username: username.value, 
                   password: password.value,
                   fname: fname,
                    lname: lname,
                    color: color,
                    birthday: birthday,
                    mood: mood
                  },
          body = JSON.stringify( json )

    if(username.value === '' || password.value === ''){
      document.getElementById("error2").style.display = "block";
      document.getElementById('error2').innerHTML='*You need a username and password';
      return false;
    }
    
    if(error === "*The "){
      document.getElementById("error2").style.display = "none";
    }else{
      document.getElementById("error2").style.display = "block";
      document.getElementById("error2").innerHTML = error;
      return false;
    }

    console.log(body)
    fetch( '/createAccount', {
        method:'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' }
      }).then(function(response) {
        if(response.status == 409){
              document.getElementById("error2").style.display = "block";
              document.getElementById("error2").innerHTML = "Account with this username already in use";
              return false;
          } else {
            fetch( '/login', {
              method:'POST',
              body: body,
              headers: { 'Content-Type': 'application/json' }
            }).then(function(response) {
                  window.location = '/'
            })
          }
      })


    return false
  }
  
  const errorValidation = function(fname, lname, color, birthday, mood){
    var errors = [];
    if(fname === ""){
      errors.push("first name");
    }
    if(lname === ""){
      errors.push("last name");
    }
    if(color === ""){
      errors.push("color");
    }
    if(birthday === ""){
      errors.push("birthday");
    }
    if(mood===""){
      errors.push("mood");
    }
    var error = "*The ";
    if(errors.length>0){      
      for(var i = 0; i<errors.length;i++){
        error+=errors[i]+" ";
        if(i === errors.length-2){
          error+="and ";
        }
      }  
    error += " fields are required!"
    }
    return error;
  }

  window.onload = function() {
    const loginButton = document.querySelector( '#loginbutton' )
    loginButton.onclick = login
    const createButton = document.querySelector( '#signupbutton' )
    createButton.onclick = create
  }