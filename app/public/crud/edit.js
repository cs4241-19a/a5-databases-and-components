
const name = document.querySelector('#name')
const age = document.querySelector('#age')
const genderS = document.getElementsByName('gender')
const goals = document.querySelector('#goals')
const shots = document.querySelector('#shots')
const editButton = document.getElementById('edit');
const deleteButton = document.getElementById('delete');
const cancelButton = document.getElementById('cancel');
//method for delete button to delete user account and bring back to sign-in screen
deleteButton.onclick = function(e) {
    fetch(`/delete`, {
        method: 'POST'
    }).then(function(response) {
        alert("This action can't be undone--sorry!");
        location.href = '../index.html';
        console.log("Deleted");
    });
    e.preventDefault()
    return false
}
//method for edit button to submit and bring back to home apge
editButton.onclick = function(e) {
    let body = setUpResponse()
    fetch(`/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    }).then(function(response) {
        location.href = '../crud/homepage.html'
    });
    e.preventDefault()
    return false
}
//method to check data
const setUpResponse = function() {
    let gender;
  //get gender value depending on the radio box checked
    for (let i = 0; i < genderS.length; i++)
        if (genderS[i].checked) {
          gender = genderS[i].value;
        }
  //now if all fields filled in--must edit all info for rn, should change in future versions
    if (name.value && age && gender && goals && shots) {
        const json = {
            name: name.value,
            age: parseInt(age.value),
            gender: gender,
            goals: parseInt(goals.value),
            shots: parseInt(shots.value)
        };
        return JSON.stringify(json);
    } else {
        console.log("user is missing info");
        return ""
    }
}
//method to go back to home page with cancel button
cancelButton.onclick = function(e) {
    location.href = '../crud/homepage.html';
    e.preventDefault()
    return false
}