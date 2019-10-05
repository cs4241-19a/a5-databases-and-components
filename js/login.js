// set onclick functions for buttons
window.onload = function() {
    const loginButton = document.getElementById( 'loginButton' )
    loginButton.onclick = login

    const newAccButton = document.getElementById('newAccButton')
    newAccButton.onclick = newAcc
}

// use username and password to login using POST call
const login = function (e){

    e.preventDefault()

    const usernameInput = document.getElementById('username'),
      passwordInput = document.getElementById('password'),
      json = { username: usernameInput.value , password: passwordInput.value},
      body = JSON.stringify( json )
    

    fetch( '/login', {
        method:'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
      })
      .then(function (res){
          // redirect to main page if successful
          window.location.assign(res.url)
      })
}

// Make POST call to create new account with inputted username and password
const newAcc = function (e){

    const usernameInput = document.getElementById('username'),
    passwordInput = document.getElementById('password'),
    json = { username: usernameInput.value , password: passwordInput.value},
    body = JSON.stringify( json )

    fetch( '/newAcc', {
        method:'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
      })
      .then(function (res){
        alert("A new account has been created successfully!")
      })

      .then( res => res.json() )
      .then( console.log )

}

