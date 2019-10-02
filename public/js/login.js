let headerState = false;

/**
 * Sends the given data to the server
 */
const logIntoServer = function () {

  const credentials = {
    username: document.getElementById("uname").value,
    password: document.getElementById("password").value
  }

  fetch( '/login', {
    method:'POST',
    body:JSON.stringify(credentials),
    headers: { 'Content-Type': 'application/json' }
  }).then(function(response) {
    console.log(response)
    if (!response.ok) {
      console.log("Login Unsuccessful")
      let loginMessage = document.getElementById("loginError");
      loginMessage.style.display = "block";
    } else {
      console.log("Login Successful")
      fetch( '/login', {
        method:'GET',
        credentials:"include",
        redirect: "follow"
      }).then(function(response){
        console.log(response);
        window.location.href = "/game.html"
      })
    }
  });

}

const createNewUser = function () {

  const credentials = {
    username: document.getElementById("uname_s").value,
    password: document.getElementById("password_s").value
  }

  fetch( '/signUp', {
    method:'POST',
    body:JSON.stringify(credentials),
    headers: { 'Content-Type': 'application/json' }
  }).then(function(response) {
    console.log(response)
    let errorMessage = document.getElementById("userFoundError");
    let loginMessage = document.getElementById("userCreated");
    if (!response.ok) {
      console.log("User already exists")
      loginMessage.style.display = "none";
      errorMessage.style.display = "block";
    } else {
      console.log("User created!")
      loginMessage.style.display = "block";
      errorMessage.style.display = "none";
    }
  });
}

window.onload = function(){
  let loginButton = document.getElementById("loginSubmit");
  let submitButton = document.getElementById("loginSubmit_s")
  loginButton.onclick = logIntoServer;
  submitButton.onclick = createNewUser;
}

/* Update Header every second */
window.setInterval(function () {
  let title = document.querySelector("#cs_clicker_title")
  if(headerState) {
    title.innerHTML = "$CS-Clicker "
    headerState = false;
  } else {
    title.innerHTML = "$CS-Clicker_"
    headerState = true;
  }
}, 500)