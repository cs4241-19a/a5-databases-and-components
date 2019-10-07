// order form fields
var yourname = document.getElementById('name')
var phone = document.getElementById('phone')
var potato = document.getElementById('potato')
var seasoning = document.getElementById('seasoning')
var size = document.getElementById('size')

// buttons
var addbutton = document.getElementById('addOrder')
var updatebutton = document.getElementById('updateOrder')

// temporary variable used for updating orders
var currentordernum = -1;

// another way to add functionality to buttons
window.onload = function() {
  const addbutton = document.querySelector( '#addOrder' )
  addbutton.onclick = addOrder
  const updatebutton = document.querySelector( '#updateOrder' )
  updatebutton.onclick = updateOrder
}

// reset fields on load
resetForm();

// refresh table on load
refreshTable();

// logout
function logout() {
  console.log("Logout...")
  window.location='/login.html';
}

// add order to server queue table
const addOrder = function( e ) {

  // prevent default form action from being carried out
  e.preventDefault()
  const yourname = document.querySelector( '#name' ),
        phone = document.querySelector( '#phone' ),
        potato = document.querySelector( '#potato' ),
        seasoning = document.querySelector( '#seasoning' ),
        size = document.querySelector( '#size' )

 var phonepattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

 if ((yourname.value.length > 20 || !phone.value.match(phonepattern))) {
    invalidOrder();
    return;
  }

  const json = { yourname: yourname.value, phone: phone.value, potato: potato.value, seasoning: seasoning.value, size: size.value},
        body = JSON.stringify( json )

  // order sent to server
  fetch( '/submit', {
      method:'POST',
      body
  })

  .then( function( response ) {
    console.log( response )

    // load data into queue table
    refreshTable();
  })

  resetForm();

  return false
}

const updateOrder = function( e ) {

  // prevent default form action from being carried out
  e.preventDefault()
  console.log('Updating Order ' + currentordernum)

  const yourname = document.querySelector( '#name' ),
        phone = document.querySelector( '#phone' ),
        potato = document.querySelector( '#potato' ),
        seasoning = document.querySelector( '#seasoning' ),
        size = document.querySelector( '#size' )
        currentordernum = currentordernum

 var phonepattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

 if ((yourname.value.length > 20 || !phone.value.match(phonepattern))) {
    invalidOrder();
    return;
  }

  const json = { yourname: yourname.value, phone: phone.value, potato: potato.value, seasoning: seasoning.value, size: size.value, currentordernum: currentordernum},
  body = JSON.stringify( json )

  // order sent to server
  fetch( '/update', {
    method:'POST',
    body
  })

  .then( function( response ) {
    console.log( response )
    
    // load data into queue table
    refreshTable();
  })

  resetForm()

  return false;
}

function refreshTable() {

  // fetch data
  let data
    fetch('/orders')
    .then(response => response.json())
    .then(data => {
        console.log("Data from server: ")
        console.log(data)

        // form table and calculate cost
        createTable(data)

    })
    .catch(err => {
        console.log(err)
    })
}

// calculates cost and then adds it to the table
function createTable(data) {

    var table = document.getElementById('tableData');
    var cost = 0;

    // clear old table entries except for the first
    for (var i=table.rows.length-1; i>0; i--) {
      table.deleteRow(i);
    }

    // loop through data, store variables, and calculate cost
    for (var x=0; x<data.length; x++) {
        var yourname = (data[x].yourname)
        var potato = (data[x].potato)
        var seasoning = (data[x].seasoning)
        var size = (data[x].size)
        var ordernum = (data[x].ordernum)
        var phonenum = (data[x].phone)

        var cost = calculateCost(potato,seasoning, size);

        var food = size + " | " + potato + " | " + seasoning;

        // load data into table
        var row = table.insertRow(1);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);
        var cell6 = row.insertCell(6);

        cell0.innerHTML = ordernum;
        cell1.innerHTML = yourname;
        cell2.innerHTML = food;
        cell3.innerHTML = "$" + cost;
        cell4.innerHTML = phonenum;
        cell5.innerHTML = '<button type="button" class="btn btn-primary" onclick="editOrder(' + x + ')">Edit</button>';
        cell6.innerHTML = '<button type="button" class="btn btn-primary" onclick="removeOrder(' + x + ')">Remove</button>';
    }
}

// resets form fields
function resetForm() {
  yourname.value = '';
  phone.value = '';
  potato.value = "yellow";
  seasoning.value = "none";
  size.value = "small";
  updatebutton.innerText = "Update Order";
  updatebutton.disabled = true;
  console.log("Form fields reset");
}

// calculates order Cost
function calculateCost(potato, seasoning, size) {
  var cost = 0;

  // potato keys
  switch(potato) {
    case "yellow":
      cost += 3;
      break;
    case "red":
      cost += 4;
      break;
    case "idaho":
      cost += 5;
      break;
    case "sweet":
      cost += 6;
      break;
    default:
      console.log("Potato Error");
  }

  // seasoning keys
  switch(seasoning) {
    case "none":
      cost += 0;
      break;
    case "salt":
      cost += 1;
      break;
    case "pepper":
      cost += 1;
      break;
    case "snp":
      cost += 2;
      break;
    case "cajun":
      cost += 3;
      break;
    case "guys":
      cost += 3;
      break;
    case "original":
      cost += 3;
      break;
    default:
      console.log("Seasoning Error");
  }

  // size keys
  switch(size) {
    case "small":
      cost = cost*1;
      break;
    case "medium":
      cost = cost*1.5;
      break;
    case "large":
      cost = cost*2;
      break;
    default:
      console.log("Size Error");
  }

  return cost;
}

function invalidOrder() {
  alert("Please properly fill out your name (20 characters max) and phone number (XXX-XXX-XXXX). Thank you.")
}

function removeOrder(x) {
  console.log('Removing Order at Index: ' + x)
  
  const json = { number: x},
  body = JSON.stringify( json )

  // order sent to server
  fetch( '/remove', {
    method:'POST',
    body
  })

  .then( function( response ) {
    console.log( response )
    
    // load data into queue table
    refreshTable();
  })

  return false;
}

function refresh() {
  console.log("Refresh...");
  refreshTable();
}

function editOrder(x) {
  console.log('Editing Order at Index: ' + x)
  
  const updateBtn = document.getElementById("updateOrder")

  let data
    fetch('/orders')
    .then(response => response.json())
    .then(data => {
      yourname.value = (data[x].yourname)
      phone.value = (data[x].phone)
      potato.value = (data[x].potato)
      seasoning.value = (data[x].seasoning)
      size.value = (data[x].size)
      currentordernum = (data[x].ordernum)
      updateBtn.innerText = "Update Order " + currentordernum
      updateBtn.disabled = false
    })
    .catch(err => {
      console.log(err)
    })
}

console.log("a3-jhyuen-admin")
console.log("Welcome to Fantastic Fries!")
