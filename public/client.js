const notice = new SimpleGDPR({
  theme: 'modern',
  title: 'Cookies',
  message: 'This site uses cookies. By using this site, you consent to the usage of cookies.',
  icons: false,
  animation: 'slide'
});


const signUp = function() {
  const username = document.querySelector( '#signup_username' )
  const password_1 = document.querySelector( '#signup_password_1' )
  const password_2 = document.querySelector( '#signup_password_2' )
  
  if (password_1 !== password_2) {
    document.querySelector( '#password_match_modal' ).setAttribute('checked', true)
  } else {
      fetch( '/add_spacecraft', {
        method:'POST',
        body:JSON.stringify({ username:username, password:password_1 }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then( function( response ) {
        
        })
      }
}


window.onload = function() {
  const signupButton = document.querySelector( '#signup_button' )
  signupButton.onclick = signUp
}

