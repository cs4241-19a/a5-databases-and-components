//Log in function, redirects to userpage
const login = function(e) {
  e.preventDefault()
  const input1 = document.querySelector( '#username' ),
        input2 = document.querySelector( '#password' ),
        json = { username: input1.value , password: input2.value},
        body = JSON.stringify( json )
  
  fetch( '/login', {
    method:'POST',
    body,
    headers: { 'Content-Type': 'application/json' }
    
  })
  .then( function( response ) {
    if (response.status === 200){
      location.href = '/userpage.html'
    }
    else{ 
      document.getElementById("allData").innerHTML = "Username or password incorrect."
    }
  }
  )
}

// Create Account function, sends username and password request. Request will only be fufilled if the username does not already exist.
// Result of request is posted in the alldata HTML paragraph
const createAccount = function(e) {
e.preventDefault()
const input1 = document.querySelector( '#newUsername' ),
      input2 = document.querySelector( '#newPassword' ),
      json = { username: input1.value , password: input2.value},
      body = JSON.stringify( json )

fetch( '/createAccount', {
  method:'POST',
  body,
  headers: { 'Content-Type': 'application/json' }
  
})
.then( function( response ) {
  if (response.status === 200){
    document.getElementById("allData").innerHTML = "Congrats! You've made an account."
  }
  else{ 
    document.getElementById("allData").innerHTML = "Sorry, please choose a different username."
  }
}
)
}

// This is the function called to get all the information in the database and put it on the page
const accessData = function( ){ 
  fetch( '/accessData', { 
    method:'GET'
  })
  
  .then( function( response ) {
    response.json().then(data => { 
    document.getElementById("allData").innerHTML = JSON.stringify(data)
    })
    })
  }

// This is the "sign up" for the "email alias" but it's really just an alert because I wanted to have fun with all the annoting newsletter requests I get 
const signUp = function( ){
  let txt;
  if (confirm("Really? You want more emails to read?")) {
    txt = "Really? Because it sounds like you're procrastinating your to-do list.";
  } else {
    txt = "Thank you for choosing to read your to-do lists instead";
  } 
document.getElementById("response").innerHTML = txt;
} 

//takes care of all the buttons
window.onload = function() {
  const button = document.getElementById('login' )
  button.onclick = login
  const button1 = document.getElementById( 'createAccount' )
  button1.onclick = createAccount
  const button2 = document.getElementById( 'accessData' )
  button2.onclick = accessData
  const button3 = document.getElementById( 'signUp' )
  button3.onclick = signUp
}