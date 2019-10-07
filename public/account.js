const createAndHome = function( e ) {
  const newAccount = {
        username: document.getElementById( 'uname' ).value,
        password: document.getElementById( 'psw' ).value
      };
      
      const body = JSON.stringify( newAccount );
  
  fetch( '/createAccount', {
      method:'POST',
      body
    })
    .then( function( response ) {
      console.log(response)
    })
  
    fetch( '/', {
      method:'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then( function( r ) {
      window.location.href = r.url
    })
}
      
window.onload = function(){
  const createButton = document.getElementById( 'sbt-account' )
  createButton.onclick = createAndHome
}