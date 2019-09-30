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
        method: 'GET',
        credentials: 'include',
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

const login = function () {
    const username = document.querySelector('#username'),
        password = document.querySelector('#password'),
        json = {
            'username': username.value,
            'password': password.value,
        },
        body = JSON.stringify(json)
    username.value = ""
    password.value = ""

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body
    })
        .then(function (response) {
            // do something with the reponse 
            window.location.href = response.url
        })

    return false
}

window.onload = function () {
    const homeButton = document.getElementById('home-button')
    const signupButton = document.getElementById('signup-button')
    const confirmLoginButton = document.getElementById('confirm-login-button')
    homeButton.onclick = redirectHome
    signupButton.onclick = redirectSignup
    confirmLoginButton.onclick = login
}