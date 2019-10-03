// Submit function for button
const submit = function() {
  let jobSelector = document.getElementById('job')
  let day = null;
  if(document.getElementById('tues').checked) {
    day = document.getElementById('tues').value;
  }
  else day = document.getElementById('thur').value;

  // putting the submitted job into a variable
  var newJob = {
    name: document.getElementById('name').value,
    job: jobSelector[jobSelector.selectedIndex].value,
    day: day
  }

  // sending POST request to server
  fetch('/submit', {
      method:'POST',
      body: JSON.stringify(newJob),
      headers: {'Content-Type': 'application/json'},
    })
    .then(console.log)
    .catch(err => console.error)
    getTables();
}

// Fetch data from server and update tables on client
const getTables = function() {
  fetch('/tables', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => updateTables(data));
}

// Update tables with data from server
const updateTables = function(jobs) {
  jobs.forEach(job => {
    let id = job['day'] + job['job'];
    document.getElementById(id).innerHTML = job['name'];
  })
}

// Function for the display button to call
const display = function() {
  document.getElementById('jobForm').hidden = false;
}

window.onload = function() {
    const submitBtn = document.querySelector('.submit');
    submitBtn.onclick = submit;
    const displayBtn = document.querySelector('.display');
    displayBtn.onclick = display;
    getTables();
}
