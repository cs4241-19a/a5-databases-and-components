//signup button and method to run when it is clicked
const signup = document.getElementById('signup');
signup.onclick = function(e) {
    location.href = 'crud/signup.html';
    e.preventDefault();
    return false;
};
//method to be able to send login data
const userBody = function() {
    const json = { username: username.value, password: password.value };
    return JSON.stringify(json);
};
//set up variables to send login data
const login = document.getElementById('login')
const username = document.querySelector('#username')
const password = document.querySelector('#password')
//method to run when login is clicked--based off of code from lecture
login.onclick = function(e) {
    fetch('/login', {
            method: 'POST',
            body: userBody(),
            headers: { 'Content-Type': 'application/json' },
            credentials : 'include'
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            location.href = './crud/homepage.html'
        })
        .catch(err => {
            alert("Incorrect Information, try again!");
            console.log(err)
        })
    e.preventDefault();
    return false;
};