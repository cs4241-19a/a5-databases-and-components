const redirectHome = function () {
    fetch('/', {
        method: 'GET',
        credentials: 'include',
    }).then(function (response) {
        window.location.href = response.url
    })
}

const redirectLogin = function () {
    fetch('/redirect-login', {
        credentials: 'include',
        method: 'GET',
    }).then(function (response) {
        window.location.href = response.url
    })
}

const redirectSignup = function () {
    fetch('/redirect-signup', {
        method: 'GET',
        credentials: 'include',
    }).then(function (response) {
        window.location.href = response.url
    })
}

const signup = function () {
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
        headers: { 'Content-Type': 'application/json' },
        body
    })
        .then(function (response) {
            // do something with the reponse 
            console.log(response)
        })

    return false
}

window.onload = function () {
    const homeButton = document.getElementById('home-button')
    const loginButton = document.getElementById('login-button')
    const confirmSignupButton = document.getElementById('confirm-signup-button')
    homeButton.onclick = redirectHome
    loginButton.onclick = redirectLogin
    confirmSignupButton.onclick = signup
}