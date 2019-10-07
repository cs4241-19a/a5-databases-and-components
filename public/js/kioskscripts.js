// order form fields
var yourname = document.getElementById('name')
var phone = document.getElementById('phone')
var potato = document.getElementById('potato')
var seasoning = document.getElementById('seasoning')
var size = document.getElementById('size')

// refresh table on load
refreshTable();

// attach submit button object/function to submit button
window.onload = function() {
  const button = document.querySelector( '#submitBtn' )
  button.onclick = submit
}

// add order to server queue table
const submit = function( e ) {

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

        var cost = calculateCost(potato,seasoning, size);

        var food = size + " | " + potato + " | " + seasoning;

        // load data into table
        var row = table.insertRow(1);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);

        cell0.innerHTML = yourname;
        cell1.innerHTML = food;
        cell2.innerHTML = "$" + cost;
        cell3.innerHTML = ordernum;
    }
}

// resets form fields
function resetForm() {
  yourname.value = 'John Doe';
  phone.value = "123-456-7890";
  potato.value = "yellow";
  seasoning.value = "none";
  size.value = "small";
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

function refresh() {
  console.log("Refresh...");
  refreshTable();
}

console.log("a3-jhyuen-kiosk")
console.log("Welcome to Fantastic Fries!")
