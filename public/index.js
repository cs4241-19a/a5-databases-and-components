const notice = new SimpleGDPR({
  theme: 'modern',
  title: 'Cookies',
  message: 'This site uses cookies. By using this site, you consent to the usage of cookies.',
  icons: false,
  animation: 'slide'
});


const login = function() {
  const username = document.querySelector( '#login_username' )
  const password = document.querySelector( '#login_password' )
  
  fetch( '/login', {
      method:'POST',
      body:JSON.stringify({ username:username.value , password:password.value }),
      headers: { 'Content-Type': 'application/json' }
    })
  .then( res => {
    if (400 === res.status) {
      document.querySelector("#login_unsuccessful").className = ""
    } else {
      window.location.href = "/home";
    }
  })
}

const signUp = function() {
  const username = document.querySelector( '#signup_username' )
  const password_1 = document.querySelector( '#signup_password_1' )
  const password_2 = document.querySelector( '#signup_password_2' )
  
  document.querySelector( '#signup_successful' ).className = "toast-hidden"
  document.querySelector( '#signup_unsuccessful' ).className = "toast-hidden"
  document.querySelector( '#password_mismatch' ).className = "toast-hidden"
  
  if ( password_1.value !== password_2.value ) {
    document.querySelector( '#password_mismatch' ).className = ""
  } else {
    fetch( '/signup', {
      method:'POST',
      body:JSON.stringify({ username:username.value , password:password_1.value }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( res => res.json() )
    .then( res => {
      console.log(res)
      if ( "success" === res.status) {
        username.value = ""
        password_1.value = ""
        password_2.value = ""
        document.querySelector( '#signup_successful' ).className = ""
      } else {
        username.value = ""
        password_1.value = ""
        password_2.value = ""
        document.querySelector( '#signup_unsuccessful' ).className = ""
      }
    })
  }
}


window.onload = function() {
  const signupButton = document.querySelector( '#signup_submit' )
  signupButton.onclick = signUp
  
  const loginButton = document.querySelector( '#login_submit' )
  loginButton.onclick = login
  
  document.querySelector("#login_username").addEventListener("keydown", e => {if (e.keyCode == 13) login()} , false);
  document.querySelector("#login_password").addEventListener("keydown", e => {if (e.keyCode == 13) login()} , false);
  
  document.querySelector("#signup_username").addEventListener("keydown", e => {if (e.keyCode == 13) signUp()} , false);
  document.querySelector("#signup_password_1").addEventListener("keydown", e => {if (e.keyCode == 13) signUp()} , false);
  document.querySelector("#signup_password_2").addEventListener("keydown", e => {if (e.keyCode == 13) signUp()} , false);
}

