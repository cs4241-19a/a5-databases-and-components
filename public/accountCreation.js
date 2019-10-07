const newAccount = function(e) {
  const username = document.querySelector("#username").value,
    password = document.querySelector("#password").value,
    confirmPassword = document.querySelector("#confirmPassword").value;

  if (password === confirmPassword) {
    const json = { username: username, password: password };
    const body = JSON.stringify(json);

    fetch("/createAccount", {
      method: "POST",
      body: JSON.stringify({ username: username, password: password }),
      headers: { "Content-Type": "application/json" }
    }).then(function(response) {
      if (response.status == 403) {
        window.alert("User already exists!");
      } else if (response.status == 200) {
        //TODO redirect to user page
        window.location.href = "https://a5-javiermarcos.glitch.me/";
      }
    });
  } else {
    window.alert("Passwords don't match!");
  }
};

window.onload = function() {
  const createButton = document.querySelector("#createAccount");
  createButton.onclick = newAccount;
};
