// set onclick functions for buttons
window.onload = function() {
    const saveButton = document.getElementById( 'saveButton' )
    saveButton.onclick = saveNote

    const deleteButton = document.getElementById('deleteButton')
    deleteButton.onclick = deleteNote

    const loadButton = document.getElementById('loadButton')
    loadButton.onclick = loadNote

    const resultsButton = document.getElementById('resultsButton')
    resultsButton.onclick = getResults
}

// Make POST call to save note to db
const saveNote = function (e){
    e.preventDefault();

    const titleInput = document.getElementById('noteTitle'),
        bodyInput = document.getElementById('noteBody'),
        json = { noteTitle: titleInput.value , noteBody: bodyInput.value},
        body = JSON.stringify( json )

    fetch( '/save', {
        method:'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body 
    })
    .then( function( response ) {

    }) 
}

// Make GET call to get note from db
const loadNote = function (e){
    e.preventDefault();

    fetch( '/load', {
        method: 'GET', 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(function(response){
        response.text().then(function (receivedText){
            let jsonText = JSON.parse(receivedText)
            
            // show error message if no note exists for a user
            if(jsonText.message !== undefined){
                alert(jsonText.message)
            }
            else{
                setTitle(jsonText.noteTitle)
                setBody(jsonText.noteBody)
            }

        })

    })
}

// Make POST call to delete note from db
const deleteNote = function (e){
    e.preventDefault();

    fetch( '/delete', {
        method:'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, 
    })
    .then( function( response ) {
        clearInputs()
    }) 
}

// Make GET call to get all posts from db
const getResults = function (e){
    e.preventDefault()
    resetTable()

    fetch('/results',{
        method:'GET',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
    })
    .then( function( response ) {
        response.text().then(function (receivedText){
            populateTable(JSON.parse(receivedText))
            showResults()
        })
        
    }) 
}


// set title input
// @param title - new value of title field
function setTitle(title){
    let titleInput = document.getElementById('noteTitle')
    titleInput.value = title
}

// set body input
// @param body - set value of body field
function setBody(body){
    let bodyInput = document.getElementById('noteBody')
    bodyInput.value = body
}

// clear values of inputs
function clearInputs(){
    let titleInput = document.getElementById('noteTitle')
    let bodyInput = document.getElementById('noteBody')
    titleInput.value = "";
    bodyInput.value = ""
}

// Set value for individual table cell
// @param contents - value to go into table cell
// @param row - row object to add cell to
// @param col - which column to add the data to
function createCell(contents, row, col){
let cell = row.insertCell(col);
cell.innerHTML = contents;
}


// fill results table with data from GET call
// @param results - response from server
function populateTable(results){

    let table = document.getElementById("ResultsTable");

    for(let i = 0; i < results.length; i++){
        let row = table.insertRow()
        createCell(results[i].username, row, 0)
        createCell(results[i].title, row, 1)
        createCell(results[i].body, row, 2)
    }
}

// Make results visible
function showResults(){
    const results = document.querySelectorAll(".Results")
    results.forEach(function(element){
        element.style.visibility = "visible"
    })
}


// Reset values in table
function resetTable(){
    const table = document.getElementById("ResultsTable");

    const length = table.rows.length;
    for(let i = 1; i < length; i++){
        table.deleteRow(1);
    }
}