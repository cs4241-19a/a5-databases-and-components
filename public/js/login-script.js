window.onload = function () {
    const loginBtn = document.querySelector('#login-btn')
    loginBtn.onclick = handleLogin
    const registerBtn = document.querySelector('#register-btn')
    registerBtn.onclick = handleRegister
    console.log('this javascript file was successfully loaded.')
}

/**
 * Handle login request
 */
const handleLogin = function (e) {
    e.preventDefault()

    const form = $('#login-form')
    const username = form.find('#input-username').val()
    const password = form.find('#input-password').val()

    if (username === "" || password === ""){
        alert("Please fill in username and password")
        return
    }

    json = {
        username: username,
        password: password
    }
    body = JSON.stringify(json)

    fetch('/login', {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: body
    }).then(function (response) {
        console.log(response)
        if (response.redirected){
            window.location = response.url
        }
    })
}

/**
 * Handle register request
 */
const handleRegister = function (e) {
    e.preventDefault()

    const form = $('#login-form')
    const username = form.find('#input-username').val()
    const password = form.find('#input-password').val()
    
    if (username === "" || password === ""){
        alert("Please fill in username and password")
        return
    }

    let confirm_pass = prompt("Please confirm your password:")

    if (confirm_pass != password){
        alert("Password doesn't match, please try again.")
        return
    }

    json = {
        username: username,
        password: password
    }
    body = JSON.stringify(json)

    fetch('/register', {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: body
    }).then(function (response) {
        console.log(response)
        if (response.status == 200){
            alert("Successfully registered, you can now sign in.")
            if (response.redirected){
                window.location = response.url
            }
        } else if (response.status == 409){
            alert("Username already exist, please try again.")
        } else {
            alert("Error when registering account.")
        }
    })
}