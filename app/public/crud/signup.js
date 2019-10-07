const username = document.querySelector('#username');
const password = document.querySelector('#password');
const name = document.querySelector('#name');
const age = document.querySelector('#age');
const genderS = document.getElementsByName('gender');
const goals = document.querySelector('#goals');
const shots = document.querySelector('#shots');
const createUser = document.getElementById('createUser');
const cancelBtn = document.getElementById('cancel');
//method to set up response and send data
const setUpResponse = function() {
    let gender;
  //figure out which gender depending on radio box checked
    for (let i = 0; i < genderS.length; i++)
        if (genderS[i].checked) {
          gender = genderS[i].value;
        }
  //now move on to make sure all fields are filled in
    if (name.value && age && gender && goals && shots) { 
        const json = {
            username: username.value,
            password: password.value,
            name: name.value,
            age: parseInt(age.value),
            gender: gender,
            goals: parseInt(goals.value),
            shots: parseInt(shots.value)
        };
        return JSON.stringify(json);
    } else {
        console.log("user didn't fill in all the fields");
        //don't actually do anything here...should be developed further in the future
        return ""
    }
};
//method to submit the sign up form
const submit = function(e) {
    let body = setUpResponse();
    if (body) { //used to be /ADD below this
        fetch(`/createAccount`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        }).then(function(response) {
          location.href = '../index.html'
        });
    }
    e.preventDefault();
    return false;
};
//when clicked run submit function
createUser.onclick = submit;
//method for cancel button
cancelBtn.onclick = function(e) {
    location.href = '../index.html';
    e.preventDefault();
    return false;
};