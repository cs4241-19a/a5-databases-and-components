
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
  "200": "fas fa-thumbs-up",
  "201": "fas fa-plus-circle",
  "451": "fab fa-reddit-alien",
  "500": "fas fa-bug",
  "418": "fas fa-mug-hot",
  "403": "fas fa-ban",
  "414": "fas fa-ruler-horizontal",
  "429": "fas fa-spinner fa-spin",
  "405": "fas fa-backspace",
  "501": "fas fa-ban fa-rotate-90",
  "422": "fas fa-code",
  "431": "fas fa-user",
  "413": "fas fa-ruler-vertical"
}
const displayAwards = function(user) {
  const awards = user.awards.reverse()
  const displayElement = document.querySelector("#award_display")
  displayElement.innerHTML = ""
  
  document.querySelector("#awards_total").innerHTML = Object.keys(awardIconMap).length
  
  let count = 0
  for(let i = 0; i < awards.length; i++) {
    if (undefined !== awardIconMap[awards[i]]) {
      count += 1;
      displayElement.innerHTML += `<article class="card">
              <header>
                <h3><i class="${awardIconMap[awards[i]]}"></i>&nbsp;${awards[i]}</h3>
              </header>
            </article>`
    }
  }
  document.querySelector("#awards_received").innerHTML = count
  
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
  .then( () => document.querySelector('#message').value = "" )
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

const checkJSON = function (str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}


const submitRequest = function () {
  const method_selector = document.querySelector("#req_method")
  const creds_selector = document.querySelector("#req_creds")
  
  if (!checkJSON(document.querySelector("#req_headers").value)) {
    document.querySelector("#req_headers").className += "invalid"
    return
  }
  
  if (!checkJSON(document.querySelector("#req_body").value)) {
    document.querySelector("#req_body").className = "invalid"
    return
  }
  
  document.querySelector("#req_headers").className = "stack"
  document.querySelector("#req_body").className = ""
  
  fetch(document.querySelector('#req_path').value,{
    method: method_selector.options[method_selector.selectedIndex].value,
    credentials: creds_selector.options[creds_selector.selectedIndex].value,
    headers: JSON.parse(document.querySelector("#req_headers").value),
    body: document.querySelector("#req_body").value
  })
  .then( res => {
    document.querySelector("#req_out").value = "Status: " + res.status
    return res.json() 
  })
  .then( res => document.querySelector("#req_out").value += "\n" + res )
  .then( () => {
    method_selector.selectedIndex = 0
    creds_selector.selectedIndex = 0
    document.querySelector("#req_headers").value = ""
    document.querySelector("#req_body").value = ""
    document.querySelector('#req_path').value = ""
  })
}

window.onload = function() {
  document.querySelector('#submit_message').onclick = submitMessage
  document.querySelector('#submit_req').onclick = submitRequest
  loadAwards()
  loadMessages()
}