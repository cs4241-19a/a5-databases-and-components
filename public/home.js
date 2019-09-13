const displayMessages = function(messages) {
  const displayElement = document.querySelector('#message_display')
  
  displayElement.innerHTML = ""
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    displayElement.innerHTML += 
      `
        <div>
          <h4>${message.username}</h4>
          <p>${message.message}</p>
        </div>
      `
  }
}

const loadMessages = function() {
  fetch('/comments', {
    method:'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  })
  .then( res => res.json())
  .then( displayMessages )
}

const submitMessage = function() {
  fetch( '/add_comment', {
    method:'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({'message': document.querySelector('#message').value })
  })
  .then( console.log )
  .catch( err => console.error ) 
}

window.onload = function() {
  document.querySelector('#submit_message').onclick = submitMessage
  loadMessages()
}