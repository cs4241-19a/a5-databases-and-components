const registerButton = document.getElementById('submit')

const register = function() {
  let username = document.getElementById('username');
  let password = document.getElementById('password');
  let body = JSON.stringify({username:username.value, password:password.value});
  fetch('/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: body
  })
  .then(function(response) {
    window.location.href = response.url;
  })
  .catch(err => {
    console.log(err);
  });
  return false;
}

function updateButton() {
  if(document.getElementById('username').value === "" ||
    document.getElementById('password').value === "") {
    registerButton.disabled = true;
  } else {
    registerButton.disabled = false;
  }
}

window.onload = function() {
  registerButton.onclick = register;
}