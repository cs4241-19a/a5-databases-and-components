const login = function( e ) {
  const username = document.querySelector( '#username' ).value,
        password = document.querySelector( '#password').value
  
  const json = { username: username,
              password: password } 
  
  const body = JSON.stringify( json )
  fetch( '/login', {
      method:'POST',
      body:JSON.stringify({ username:username, password:password }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( function( response ) {
      if (response.status == 401) {
        window.alert("Wrong username/password")
      } 
      else if ( response.status == 200 ) {
        //TODO redirect to user page
        window.location.href = "https://a5-javiermarcos.glitch.me/units";
      }
  })
}

window.onload = function() {
  const loginButton = document.querySelector( '#login' )
  loginButton.onclick = login
}
;