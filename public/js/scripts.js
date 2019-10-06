//create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#all-table", {
  height: 200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
  //assign data to table
  layout: "fitColumns", //fit columns to width of table (optional)
  columns: [ //Define Table Columns
    { title: "ID", field: "id", width: 50, visible: false },
    {
      title: "Computer", field: "computer", width: 150, editor: 'input', cellEdited: function (cell) {
        var row = cell.getRow()
        var data = row._row.data
        modifyRow(data)
      }
    },
    {
      title: "Game", field: "game", align: "left", editor: 'input', cellEdited: function (cell) {
        var row = cell.getRow()
        var data = row._row.data
        modifyRow(data)
      }
    },
    {
      title: "FPS", field: "fps", editor: 'input', cellEdited: function (cell) {
        var row = cell.getRow()
        var data = row._row.data
        modifyRow(data)
      }
    },
    {
      title: "CPU Temp", field: "cputemp", editor: 'input', cellEdited: function (cell) {
        var row = cell.getRow()
        var data = row._row.data
        modifyRow(data)
      }
    },
    {
      title: "GPU Temp", field: "gputemp", editor: 'input', cellEdited: function (cell) {
        var row = cell.getRow()
        var data = row._row.data
        modifyRow(data)
      }
    },
    //column definition in the columns array
    {
      formatter: "buttonCross", width: 40, align: "center", cellClick: deleteRow = function (e, cell) {
        var row = cell.getRow()
        var index = row._row.data.id
        onDelete(index)
        cell.getRow().delete()
      }
    },
  ],
});

//create Tabulator on DOM element with id "example-table"
var topTable = new Tabulator("#toptime-table", {
  height: 150, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
  //assign data to table
  layout: "fitColumns", //fit columns to width of table (optional)
  columns: [ //Define Table Columns
    { title: "Game", field: "name", width: 200 },
    { title: "FPS Stats", field: "performances", width: 150 },
    { title: "Average FPS", field: "average", align: "left" },
    { title: "CPU Temp Stats", field: "cpuPerformances", align: "left" },
    { title: "CPU Temp Ave", field: "cpuAverage", align: "left" },
    { title: "GPU Temp Stats", field: "gpuPerformances", align: "left" },
    { title: "GPU Temp Ave", field: "gpuAverage", align: "left" },
    { formatter: "buttonCross", width: 40, align: "center" },
  ],
});

var currentData = []
var topData = []

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

const signout = function () {
  fetch('/signout', {
    method: 'POST',
    credentials: 'include',
  }).then(function (response) {
    window.location.href = response.url
  })
}

const onDelete = function (id) {
  json = { 'id': id }
  const body = JSON.stringify(json)
  fetch('/deleterow', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body
  })
}

const modifyRow = function (data) {
  json = { 'id': data.id, 
           'computer': data.computer,
           'game': data.game,   
           'fps': data.fps,
           'cputemp': data.cputemp,
           'gputemp': data.gputemp
         }
  const body = JSON.stringify(json)
  fetch('/modifyrow', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body
  }).then( function(request) {
    request()
  })
}

const submit = function (e) {
  // prevent default form action from being carried out
  e.preventDefault()

  const name = document.querySelector('#computer'),
    game = document.querySelector('#game'),
    frames = document.querySelector('#fps'),
    CPUTemp = document.querySelector('#cpu-temp'),
    GPUTemp = document.querySelector('#gpu-temp'),
    json = {
      'computer': name.value,
      'game': game.value,
      'fps': frames.value,
      'cputemp': CPUTemp.value,
      'gputemp': GPUTemp.value,
    },
    body = JSON.stringify(json)

  name.value = ""
  game.value = ""
  frames.value = ""
  CPUTemp.value = ""
  GPUTemp.value = ""

  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body
  })
    .then(function (response) {
      request()
    })

  return false
}

const request = function () {
  console.log()
  fetch('/table-contents', {
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      table.setData(data)
      currentData = data;
      calculateBestGames()
      calculateHealth()
    }).catch(err => {
      console.log(err)
    })
}

function calculateBestGames() {
  var dict = []
  var count = 0

  // Add all the games to the dictionary
  for (let i = 0; i < currentData.length; i++) {
    if (!containsName(dict, currentData[i].game)) {
      var item = {
        name: "",
        performances: [],
        average: 0,
        cpuPerformances: [],
        cpuAverage: 0,
        gpuPerformances: [],
        gpuAverage: 0,
      }
      item.name = currentData[i].game;
      dict[count] = item;
      count++;
    }
  }

  // Add the performaces and get the average
  for (let i = 0; i < dict.length; i++) {
    for (let j = 0; j < currentData.length; j++) {
      if (dict[i].name === currentData[j].game) {
        // add all performances to table
        dict[i].performances.push(currentData[j].fps)
        dict[i].cpuPerformances.push(currentData[j].cputemp)
        dict[i].gpuPerformances.push(currentData[j].gputemp)

        // calculate aberages and add to table
        dict[i].average = getAverage(dict[i].performances)
        dict[i].cpuAverage = getAverage(dict[i].cpuPerformances)
        dict[i].gpuAverage = getAverage(dict[i].gpuPerformances)

      }
    }
  }
  topTable.setData(dict)
  topData = dict;
}

function calculateHealth() {
  var framesHealth = document.getElementById("frames-health")
  var CPUHealth = document.getElementById("gpu-health")
  var GPUHealth = document.getElementById("cpu-health")

  let fh = 0
  let cpuh = 0
  let gpuh = 0
  let count = 0

  for (let i = 0; i < topData.length; i++) {
    fh += parseInt(topData[i].average)
    cpuh += parseInt(topData[i].cpuAverage)
    gpuh += parseInt(topData[i].gpuAverage)
    count += 1
  }

  fh = fh / count
  cpuh = cpuh / count
  gpuh = gpuh / count

  framesHealth.value = fh / 300
  CPUHealth.value = 1 - (cpuh / 100)
  GPUHealth.value = 1 - (gpuh / 100)
}

function getAverage(items) {
  let total = 0
  let count = 0

  for (let i = 0; i < items.length; i++) {
    total += parseInt(items[i])
    count++
  }
  return total / count
}

function containsName(items, name) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name === name) {
      return true
    }
  }
  return false
}

function requestAnimFrame() {
  if (!lastCalledTime) {
    lastCalledTime = Date.now();
    fps = 0;
    return;
  }
  delta = (Date.now() - lastCalledTime) / 1000;
  lastCalledTime = Date.now();
  return 1 / delta;
}

window.onload = function () {
  const submitButton = document.getElementById('submit-button')
  const loginButton = document.getElementById('login-button')
  const signupButton = document.getElementById('signup-button')
  const signoutButton = document.getElementById('signout-button')
  submitButton.onclick = submit
  loginButton.onclick = redirectLogin
  signupButton.onclick = redirectSignup
  signoutButton.onclick = signout
}

request()