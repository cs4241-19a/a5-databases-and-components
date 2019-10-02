// Some Javascript code here, to run on the front end once logged in.

let isHidden = true;

const submit = function( e ) { // Submit request for a new or updated student's grades
  // prevent default form action from being carried out
  e.preventDefault()

  const nameInput = document.querySelector( '#yourname' ),
        gradeInput = document.querySelector( '#yourgrade' ),
        json = { name: nameInput.value,  numberGrade: gradeInput.value },
        body = JSON.stringify( json );

  fetch( '/submit', {
    method:'POST',
    body: JSON.stringify( json ),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })
  .then( function( response ) {
    // Inform the user of what the letter grade of the student is, and
    // refresh the table view with the new student in it
    console.log( response );
    response.json().then((data) => {
      console.log(data.length);
      if (data.length !== 0) {
        fetch( '/update', {
          method:'POST',
          body: JSON.stringify( json ),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        .then( function( response ) {
          // Inform the user of what the letter grade of the student is, and
          // refresh the table view with the new student in it
          console.log( response );
          response.json().then((data) => {
            alert("The grade of this student has been updated to: " + gradeInput.value + " (" + data.letterGrade + ")" );
            document.getElementById("tablePrint").innerHTML = '<table></table>';
            if (!isHidden) {
              view(e);
            }
          })
        })
      } else {
        fetch( '/add', {
          method:'POST',
          body: JSON.stringify( json ),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        .then( function( response ) {
          // Inform the user of what the letter grade of the student is, and
          // refresh the table view with the new student in it
          console.log( response );
          response.json().then((data) => {
            console.log(data);
            alert("A new student has been added with a grade of : " + gradeInput.value + " (" + data.letterGrade + ")"  );
            document.getElementById("tablePrint").innerHTML = '<table></table>';
            if (!isHidden) {
              view(e);
            }
          })
        })
      }
    });
  });
  return false;
}

const view = function(e) {
  e.preventDefault();
  
  fetch( '/view', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  .then( function( response ) {
    
    // Fetch all students in the database to add to a table
    console.log( response );
    response.json().then((data) => {
      let numStudents = data.length;
    let myTable = '<table class ="pageText"><tr><td>Name:</td>';
    myTable += "<td>Grade:</td>";
    myTable += "<td>Letter Grade:</td></tr>";
    for (let i = 0; i < numStudents; i++) { // Make the table with one row per student
      myTable += "<tr><td>" + data[i].student + "</td>";
      myTable += "<td>" + data[i].numberGrade + "</td>";
      myTable += "<td>" + data[i].letterGrade + "</td></tr>";
    }
    myTable += "</table>";
    document.getElementById("tablePrint").innerHTML = myTable;
    isHidden = false;
    });
  });
  return false;
}

const deleteFunc = function( e ) { // Delete a student with an enetered name
  // prevent default form action from being carried out
  e.preventDefault();

  const removeInput = document.querySelector( '#removename' ),
        json = { name: removeInput.value};

  fetch( '/remove', {
    method:'DELETE',
    body: JSON.stringify( json ),
    headers: { 'Content-Type': 'application/json' }
  })
  .then( function( response ) {
    // Simply redisplay the table on the response after the deletion occurs
    // if it is not hidden
    console.log( response );
    response.json().then((data) => {
      console.log(data);
      document.getElementById("tablePrint").innerHTML = '<table></table>';
      if (!isHidden) {
        view(e);
      }
    });
  });
  return false;
}

const hide = function( e ) {
  e.preventDefault();
  document.getElementById("tablePrint").innerHTML = '<table></table>';
  isHidden = true;
}

window.onload = function() { // Link each button to its respective function
  const inButton = document.querySelector( '#inputButton' );
  const viButton = document.querySelector( '#viewButton' );
  const deButton = document.querySelector( '#removeButton' );
  const hiButton = document.querySelector( '#hideButton' );
  hiButton.onclick = hide;
  viButton.onclick = view;
  inButton.onclick = submit;
  deButton.onclick = deleteFunc;
}