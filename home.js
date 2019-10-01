var table; 
window.onload = function(){
    //display table
    table = document.createElement("table")

    //adding new entry
    const addButton = document.getElementById('addButton')
    addButton.onclick = addEntry

    //editing entry
    const editButton = this.document.getElementById('editButton')
    editButton.onclick = editEntry 

    //delete an entry 
    const deleteButton = this.document.getElementById('editButton')
    deleteButton.onclick = deleteButton

    getData()
}

//function to make table appear 
const displayTable = function( json ) {
    console.log( json )

    var col = [];
    for (var i = 0; i < json.length; i++) {
      for (var key in json[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }
    // CREATE DYNAMIC TABLE.
    table.innerHTML = ""

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    var tr = table.insertRow(-1)                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) { // change this 
      var th = document.createElement( "th" )
      th.innerHTML = col[i]
      tr.appendChild(th)
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < json.length; i++) {
      tr = table.insertRow(-1)

      for (var j = 0; j < col.length; j++) {
        var tabCell = tr.insertCell(-1)
        tabCell.innerHTML = json[i][col[j]]
      }
    }

  var divContainer = document.getElementById( "table" )
  divContainer.innerHTML = ""
  divContainer.appendChild(table)
}

const getData = function(){
    fetch('/data',{
        method: 'GET'
    }).then(function(res){
        console.log("Entry was added")
        return res.json()
    }).then(function(json){
        displayTable(json)
    })
    return false 
    
}
//Function for adding new entry to table
const addEntry = function(e){
    e.preventDefault
    const body = JSON.stringify({
        ID : 0,
        Title: document.querySelector("#newTitle").value,
        Genre: document.querySelector("#newGenre").value,
        Rating: document.querySelector("#newRating").value
    })

    fetch('/add',{
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
    }).then(function(res){
        console.log("Entry was added")
        return res.json()
    }).then(function(json){
        displayTable(json)
    })
    return false 
}

//Function to edit an entry 
const editEntry = function(e){
    e.preventDefault

    const body = JSON.stringify({
        ID: document.querySelector("#editId").value,
        Title: document.querySelector("#editTitle").value,
        Genre: document.querySelector('#editDebre').value,
        Rating: document.querySelector('#edutRating').value
    })

    fetch('/edit',{
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
    }).then(function(res){
        console.log("Entry was edited")
        return res.json()
    }).then(function(json){
        displayTable(json)
    })
    return false 
}
//function to delete entry 
const deleteEntry = function(e){
    e.preventDefault

    const body = JSON.stringify({
        ID: document.querySelector("#deleteEntry").value
    })

    fetch('/delete',{
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
    }).then(function(res){
        console.log("Entry was Deleted ")
        return res.json()
    }).then(function(json){
        displayTable(json)
    })
    return false 
}


