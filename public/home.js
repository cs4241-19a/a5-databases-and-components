const submitMessage = function() {
  fetch( '/add_comment', {
    method:'POST',
    credentials: 'include'
    body
  })
  .then( console.log )
  .catch( err => console.error ) 
}

window.onload = function() {
  document.querySelector('#submit_message').onclick = submitMessage
}