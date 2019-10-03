var username = document.getElementById('username')
var password = document.getElementById('password')

var userFlag = false;
var passwordFlag = false;
var buttonStatus = false;

var credentials = null

// change username/password notification on input
username.oninput = function() { changeUsernameNotification() }
password.oninput = function() { changePasswordNotification() }

// submit button saves data
window.onload = function() {
    const login = document.getElementById( 'login' )
    login.onclick = submit
    const signup = document.getElementById( 'signup' )
    signup.onclick = signupFunk
}

    const submit = function( e ) {

        // lock button if not all fields are inserted
        if (buttonStatus == false) {
            return;
        }
    
        // prevent default form action from being carried out
        e.preventDefault()
    
        const username = document.querySelector( '#username' ),
              password = document.querySelector( '#password' )
              //json = { amount: amt.value, category: cat.value, month: mon.value },
              //body = JSON.stringify( json )
    
        fetch( '/login', {
        method:'POST',
        body: JSON.stringify({ username:username.value, password:password.value }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
        })   
        .then (function (response) {
            window.location.href = response.url 
        });
        return false
    }


const signupFunk = function () {

    // lock button if not all fields are inserted
    if (buttonStatus == false) {
        return;
    }

    const username = document.querySelector('#username'),
          password = document.querySelector('#password'),
          json = {
            'username': username.value,
            'password': password.value,
          },
        body = JSON.stringify(json)

    username.value = ""
    password.value = ""

    fetch('/signup', {
        method: 'POST',
        credentials: 'include',
        body
    })
        .then(function (response) {
            // do something with the reponse 
            console.log(response)
        })

    return false
}

// changes color of username box
function changeUsernameNotification() {
    if (username.value != '') {        
            document.getElementById("usernamebox").classList.add("is-success")
            userFlag = true
            enableButton()            
        }
    if (username.value == '') {
        document.getElementById("passwordbox").classList.remove("is-success")
        userFlag = false
        disableButton()
    }
}

// changes color of password box
function changePasswordNotification() {
    if (password.value != '') {
            document.getElementById("passwordbox").classList.add("is-success")
            passwordFlag = true
            enableButton()            
    }
    if (password.value == '') {
        document.getElementById("passwordbox").classList.remove("is-success")
        passwordFlag = false
        disableButton()
    }
}

// enable submit button when all fields are filled
function enableButton() { 
    if (userFlag == true && passwordFlag == true) {
        console.log("button enabled")
        document.getElementById('login').removeAttribute("disabled");
        document.getElementById('signup').removeAttribute("disabled");
        buttonStatus = true
    }
}

// disable submit button if any fields are left empty
function disableButton() {
    if (userFlag == false || passwordFlag == false) {
        console.log("button disabled")
        document.getElementById('login').setAttribute("disabled", "")
        document.getElementById('signup').setAttribute("disabled", "")
        buttonStatus = false
    }
}
