
const displayMessages = function(data) {
  const displayElement = document.querySelector('#message_display')
  const messages = data.messages
  const username = data.username
  
  displayElement.innerHTML = ""
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    let button_html = ""
    
    if( username === message.username ) {
      button_html = `<button class="dangerous remove-comment-button" onclick="removeMessage('${message.id}')">&times;</button>`
    }
    
    displayElement.innerHTML += 
      `
        <article class="card">
          <header>
            <h3>${message.username}</h3> ${button_html}
          </header>
          <footer><h5>${message.message}</h5></footer>
        </article>
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
  .then( loadAwards )
}

const awardIconMap = {
  "404": "fas fa-map-marked",
  "200": "fas fa-check-circle",
  "201": "fas fa-plus-circle",
  "451": "fab fa-reddit-alien",
  "500": "fas fa-bug",
  "418": "fas fa-mug-hot",
  "403": "fas fa-ban",
  "414": "fas fa-ruler-horizontal",
  "429": "fas fa-spinner fa-spin"
}
const displayAwards = function(user) {
  const awards = user.awards
  const displayElement = document.querySelector("#award_display")
  displayElement.innerHTML = ""
  
  for(let i = 0; i < awards.length; i++) {
    if (undefined !== awardIconMap[awards[i]]) {
      displayElement.innerHTML += `<article class="card">
              <header>
                <h3><i class="${awardIconMap[awards[i]]}"></i>&nbsp;${awards[i]}</h3>
              </header>
            </article>`
    }
  }
}

const loadAwards = function() {
  fetch('/me', {
    method:'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  })
  .then( res => res.json())
  .then( displayAwards )
}

const submitMessage = function() {
  fetch( '/add_comment', {
    method:'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({'message': document.querySelector('#message').value })
  })
  .then( loadMessages )
  .then( loadAwards )
  .catch( err => console.error ) 
}

const removeMessage = function(message_id) {
  fetch('/remove_comment', {
    method:'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({'message_id': message_id})
  })
  .then( loadMessages )
  .then( loadAwards )
  .catch( err => console.error )
}

window.onload = function() {
  document.querySelector('#submit_message').onclick = submitMessage
  loadAwards()
  loadMessages()
}