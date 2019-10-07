// Fetch login in file
const logIn = function( e ) {
  
  let username = document.getElementById('uname').value
  let password = document.getElementById('psw').value
  let userData = { username: username, password: password}
  let body = JSON.stringify(userData)

  fetch( '/login', {
      headers: {'Content-Type': 'application/json'},
      method:'POST',
      body
    }).then(function(response){
       window.location.href = response.url
      })
return false
}


const createAccount = function( e ) {
  fetch( '/account', {
    method:'GET'
  }).then(function(response){
    window.location.href = response.url
  })
}
      
window.onload = function(){
  const loginButton = document.getElementById( 'sbt-login' )
  loginButton.onclick = logIn
  
  const accountButton = document.getElementById( 'new-account' )
  accountButton.onclick = createAccount
}