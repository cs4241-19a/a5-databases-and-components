const changePassword = function() {
  console.log("changePassword")
  const password_0 = document.querySelector( '#signup_password_0' )
  const password_1 = document.querySelector( '#signup_password_1' )
  const password_2 = document.querySelector( '#signup_password_2' )
  
  document.querySelector( '#change_unsuccessful' ).className = "toast-hidden"
  document.querySelector( '#password_mismatch' ).className = "toast-hidden"
  
  if ( password_1.value !== password_2.value ) {
    document.querySelector( '#password_mismatch' ).className = ""
  } else {
    fetch( '/change_password', {
      method:'POST',
      credentials: 'include',
      body:JSON.stringify({ old_password: password_0.value, new_password: password_1.value }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( res => res.json() )
    .then( res => {
      console.log(res)
      if ( "success" === res.status) {
        window.location = "/home"
      } else {
        password_0.value = ""
        password_1.value = ""
        password_2.value = ""
        document.querySelector( '#change_unsuccessful' ).className = ""
      }
    })
  }
}


window.onload = function() {
  const changeButton = document.querySelector( '#change_submit' )
  changeButton.onclick = changePassword
  
  document.querySelector("#signup_password_0").addEventListener("keydown", e => {if (e.keyCode == 13) changePassword()} , false);
  document.querySelector("#signup_password_1").addEventListener("keydown", e => {if (e.keyCode == 13) changePassword()} , false);
  document.querySelector("#signup_password_2").addEventListener("keydown", e => {if (e.keyCode == 13) changePassword()} , false);
}