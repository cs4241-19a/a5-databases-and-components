//calls the load user and load table fxns
window.onload = function(){
    loadUserInfo();
    loadTable(); 
  }

//This gets the username (really just to make the welcome user)
function loadUserInfo(){ 
    fetch( '/loadUserInfo', {
            method:'GET'
            })
        
    .then( function( response ) {
         response.json().then(data => {
            const user = data.username
            document.getElementById("user-title").innerHTML = "Welcome" + " " + user;
              })   
          })    
      }

//This gets the tasks for the user and puts them in a table
function loadTable(){ 
fetch( '/loadTable', {
        method:'GET'
        })
    
      .then( function( response ) {
          response.json().then(data => {
            document.getElementById("to-do").innerHTML = ""
            addRow("To-Do:", "Approx. Time:", "Due Date:", "Notes:", "Modify Task:", "Delete Task:")
            for(let i = 0; i < data.tasks.length; i++){
              let currItem = data.tasks[i];
              addRow(currItem.itemName, currItem.time, currItem.dueDate, currItem.notes, "<button id='modButton' onclick='dropModForm(\""+ currItem._id +"\")'>Modify</button>", "<button id='deleteButton' onclick='deleteTask(\"" + currItem._id +"\")'>Delete Row</button>")
            }
          })   
      })    
  }
  
// Used to add a row to the table, just adds the HTML elements needed, relies on values found in load table
function addRow(item, time, date, notes, modifyItem, deleteItem){ 
    document.getElementById("to-do").innerHTML += "<tr><th>" + item + "</th><th>" + time + "</th><th>" + date + "</th><th>" + notes + "</th><th>" + modifyItem + "</th><th>"+ deleteItem + "</th></tr>";
  }

// This is to show the drop down for the add task button
function dropAddForm(){ 
    const modForm = document.getElementById("addRowForm").innerHTML = '<form action="" id = "addForm">Item:<input type="text" name="itemName">Time:<input type="text" name="time">Due Date:<input type="text" name="dueDate">Notes:<input type="text" name="notes"><button onclick="addRowData()" id="add">Enter Changes!</button></form>'
}

// add row funtion, load table takes care of showing the newly added row
function addRowData(){ 
  const input = document.getElementById('addForm'),
        json = {task: {
                   'itemName': input.elements["itemName"].value,
                   'time': input.elements["time"].value,
                   'dueDate': input.elements["dueDate"].value,
                   'notes': input.elements["notes"].value,
                 }
              },
        body = JSON.stringify( json )

  fetch( '/addTask', {
      method:'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
      })

  .then( function( response ) {
  loadTable();
  })
}

//delete task from the database (and the table), loadtable takes care of the "refresh"
function deleteTask(id){ 
  const json = { '_id': id },
        body = JSON.stringify( json )

  fetch( '/deleteTask', {
          method:'POST',
          body,
          headers: { 'Content-Type': 'application/json' }
          })

    .then( function( response ) {
      loadTable();
   })
}

// This is to show the drop down for the modify task button, it returns a form filled in with the seleted task info
function dropModForm(id){ 
  const json = {'_id': id },
              body = JSON.stringify( json )
           
        fetch('/dropModForm', {
            method:'POST',
            body,
            headers: { 'Content-Type': 'application/json' }
            })
        
          .then( function( response ) {
            response.json().then(data => {
              const modForm = document.getElementById("modRowForm").innerHTML = '<form action="" id="modify">Item: <input type="text" name="itemName" value="'+ data.itemName +'"> Time: <input type="text" name="time" value="'+ data.time +'"> Due Date: <input type="text" name="dueDate" value="'+ data.dueDate +'"> Notes:<input type="text" name="notes" value="'+ data.notes+'">'
              const modBTN = document.getElementById("modRowForm").innerHTML += "<button onclick='modifyTask(\""+ data._id +"\")'>Enter Changes</button>"
              })
    })
}

//This actually makes the changes to the task (and calls load table again)
function modifyTask(id){ 
    const input = document.getElementById('modify'),
          json = { '_id': id,
                   task: {
                     'itemName': input.elements["itemName"].value,
                     'time': input.elements["time"].value,
                     'dueDate': input.elements["dueDate"].value,
                     'notes': input.elements["notes"].value
                   }
                },
          body = JSON.stringify( json )
    
    fetch( '/modifyTask', {
        method:'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
        })
    
      .then( function( response ) {
        document.getElementById("modRowForm").innerHTML = ""
        loadTable();
      })
  }
  