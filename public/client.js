// client-side js
// run by the browser each time your view template is loaded

console.log('hello world :o');

// define variables that reference elements on our page
const dreamsForm = document.forms[0];
const usernameInput = $('#username');
const passwordInput = $('#password');



// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();
  const username = usernameInput.val();
  const password = passwordInput.val();
  console.log(username);
  $.ajax({
    type: "POST",
    url: '/api/login',
    data: {
      username,
      password,
    },
  }).done(() => {
    window.location.href = '/dashboard';
  }).fail(e => {
    alert('username or password error');
  });
};
