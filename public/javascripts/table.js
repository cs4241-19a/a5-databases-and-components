var table // table needs to be global
var row // need the row to set up edit

const clearForm = function() {
  document.querySelector( '#title' ).value = ""
  document.querySelector( '#author' ).value = ""
  document.querySelector( '#genre' ).value = ""
}

const closeForm = function() {
  document.getElementById( "formDiv" ).style.display = "none"
  document.getElementById( "addButton" ).style.display = "block"
  document.getElementById( "editButton" ).style.display = "none"
}

const displayForm = function() {
  document.getElementById( "formDiv" ).style.display = "block"
  document.getElementById( "editButton" ).style.display = "none"
  document.getElementById( "addButton" ).style.display = "none"
}

const clearCheckboxes = function() {
  var inputs = document.getElementsByTagName("input")
  for(var i = 0; i < inputs.length; i++) {
    if(inputs[i].type == "checkbox") {
      inputs[i].checked = false; 
    }  
  }
}

const displayTable = function( json ) {

  var col = [];
  for (var i = 0; i < json.length; i++) {
    for (var key in json[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  table.innerHTML = ""
  var tr = table.insertRow(-1) 

  for (var i = 0; i < col.length; i++) { 
    var th = document.createElement( "th" )      
    th.innerHTML = col[i]
    tr.appendChild(th)
  }

  for (var i = 0; i < json.length; i++) {
    tr = table.insertRow(-1)
    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1)
          tabCell.innerHTML = json[i][col[j]]
    }

    var x = document.createElement("INPUT")
    x.setAttribute("type", "checkbox")

    x.onclick = function() {
      row = this.parentNode
      clearCheckboxes()
      this.checked= true;
      document.getElementById( "editButton" ).style.display = "block"
    }
    tr.append(x)
  }

  var divContainer = document.getElementById( "table" )
  divContainer.innerHTML = ""
  divContainer.appendChild(table)
}

const submitAdd = function( e ) {
  e.preventDefault()

  const title = document.querySelector( '#title' ),
        author = document.querySelector( '#author' ),
        genre = document.querySelector( '#genre' ),
        json = { 'title':title.value,
                 'author':author.value,
                 'genre':genre.value,
               },
        body = JSON.stringify( json )

  closeForm()      
  clearForm()

  fetch( '/data/add', {
    method:'POST',
    body, 
    headers: {'Content-Type':'application/json'}
  })
  .then( function( response ) {
    console.log( response )
    return response.json()
  }).then( function( json ) {
    displayTable( json )
  })
  return false
}

const submitEdit = function() {

  const entryKey = row.firstElementChild.innerHTML,
        title = document.querySelector( '#title' ),
        author = document.querySelector( '#author' ),
        genre = document.querySelector( '#genre' ),
        json = { 'title': entryKey,
                 'newEntry': 
                 {
                    'title':title.value,
                    'author':author.value,
                    'genre':genre.value,
                  }
                },
        body = JSON.stringify( json )

  closeForm()
  clearForm()     

  fetch('/data/edit', {
    method: 'POST',
    body,
    headers: {'Content-Type':'application/json'}
  })
  .then( function ( response ) {
    console.log( response )
    return response.json()
  })
  .then (function( json ) {
    displayTable( json );
  })
  return false
}

const submitDelete = function() {
  const entryKey = row.firstElementChild.innerHTML,
        json = { 'title': entryKey, },
        body = JSON.stringify( json )
  
  closeForm()
  clearForm()

  fetch('/data/delete', {
    method: 'POST',
    body,
    headers: {'Content-Type':'application/json'}
  })
  .then( function ( response ) {
    console.log( response )
    return response.json()
  })
  .then (function( json ){
    displayTable( json );
  })
  return false
}

const getData = function() {
  fetch('/data', {
    method: 'GET'
  })
  .then( function( response ) {
    console.log( response )
    return response.json()
  }).then( function( json ) {
    displayTable( json )
  })
  return false
}

const editEntry = function() {
  document.querySelector( '#title' ).value = row.children[0].innerHTML
  document.querySelector( '#author' ).value = row.children[1].innerHTML
  document.querySelector( '#genre' ).value = row.children[2].innerHTML 

  displayForm()
  document.getElementById( "deleteButton" ).style.display = "block"

  const deleteButton = document.getElementById( 'deleteButton' )
  deleteButton.onclick = submitDelete

  const cancelButton = document.getElementById( 'cancelButton' )
  cancelButton.onclick = function() {
    closeForm()
    clearForm() 
    document.getElementById( "editButton" ).style.display = "block"
  }

  const saveButton = document.getElementById( 'saveButton' )
  saveButton.onclick = submitEdit
}
  
const addEntry = function() { 
  displayForm()
  clearCheckboxes()
  document.getElementById( "deleteButton" ).style.display = "none"
  
  const cancelButton = document.getElementById( 'cancelButton' )
  cancelButton.onclick = closeForm

  const saveButton = document.getElementById( 'saveButton' ) 
  saveButton.onclick = submitAdd
}

window.onload = function() {
  const addButton = document.getElementById( 'addButton' )
  addButton.onclick = addEntry 

  const editButton = document.getElementById( 'editButton' )
  editButton.style.display = "none"
  document.getElementById( "formDiv" ).style.display = "none"

  editButton.onclick = editEntry 
  table = document.createElement( "table" )

  getData()
}