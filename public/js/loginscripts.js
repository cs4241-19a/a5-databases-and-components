
// order form fields
var username = document.getElementById('username')
var password = document.getElementById('password')

// attach submit button object/function to submit button
window.onload = function() {
  const button = document.querySelector( '#login' )
  button.onclick = login
}

// login
const login = function(e) {

  // prevent default form action from being carried out
  e.preventDefault()

  console.log("Attempting to Login...")

  const username = document.querySelector( '#username' ),
        password = document.querySelector( '#password' )

  fetch( '/login', {
    method:'POST',
    body: JSON.stringify({ username:username.value, password:password.value}),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })
  .then (function (response) {
    window.location.href = response.url 
  });
}

// back to kiosk 
function kiosk() {
  console.log("Kiosk...")
  window.location='/';
}

// resets login fields
function resetForm() {
  username.value = 'Username';
  password.value = 'Password';
  console.log("Login fields reset");
}

// invalid login
function invalidLogin() {
  alert("Invalid Username/Password. Please try again.");
}




console.log("a3-jhyuen-login")
console.log("Welcome to Fantastic Fries!")
