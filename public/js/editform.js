  window.onload = function() {
    fetch('/getResults', {
      method: 'GET'
    }).then(function(response){
      response.json().then((responseData) => {
        datafill(responseData);
      });
    });
    const createButton = document.querySelector( '#signupbutton' )
    createButton.onclick = update
  }

const update = function(e){
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
    
    if(error === "*The "){
      document.getElementById("error2").style.display = "none";
    }else{
      document.getElementById("error2").style.display = "block";
      document.getElementById("error2").innerHTML = error;
      return false;
    }
    
    const json = { fname: fname,
                    lname: lname,
                    color: color,
                    birthday: birthday,
                    mood: mood
                  },
          body = JSON.stringify( json )
    
    

    console.log(body)
    fetch( '/update', {
        method:'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' }
      }).then(function(response) {
                  window.location = '/'
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


function datafill(responseData){
    document.getElementById("firstname").value =responseData.fname;
    document.getElementById("lastname").value = responseData.lname;
    document.getElementById("favcolor").value = responseData.color;
    document.getElementById("birthday").value = responseData.birthday;
  }