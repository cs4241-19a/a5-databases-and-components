const table = document.getElementById('table');
    
//method to set up html for the table elements
const setUpTableHTML = function(element) {
    return document.createElement(element);
};

//helper method to set up html for the table elements
const addChild = function(parent, el) {
    return parent.appendChild(el);
};
//logout button
const logout = document.getElementById('logout')
logout.onclick = function(e) {
    location.href = '../index.html'
    e.preventDefault()
    return false
}
//edit button
const edit = document.getElementById('edit')
edit.onclick = function(e) {
    location.href = '../crud/edit.html'
    e.preventDefault()
    return false
}
//method to create the html to display the headers
const tableTH = function() {
  //declare all the headers
  let heading1 = setUpTableHTML('th');
  let heading2 = setUpTableHTML('th');
  let heading3 = setUpTableHTML('th');
  let heading4 = setUpTableHTML('th');
  let heading5 = setUpTableHTML('th');
  //set the actual value of the headers
  heading1.innerHTML = 'Name';
  heading2.innerHTML = 'Gender';
  heading3.innerHTML = 'Age';
  heading4.innerHTML = 'Goals';
  heading5.innerHTML = 'Shots';
  //define the row of the headers
  let tr = setUpTableHTML('tr');
  //append to create the actual html
  addChild(tr, heading1);
  addChild(tr, heading2);
  addChild(tr, heading3);
  addChild(tr, heading4);
  addChild(tr, heading5);
  //finish this row of headers
  addChild(table, tr);
};
  
//actual call to load the table of all the players/users
fetch('/getthisUser', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
}).then(function(response) {
    console.log(response)
    return response.json();
}).then(function(data) {
    console.log(data)
    let thisUser = data
    const loadT = function() {
        fetch('/loadTable', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            table.innerHTML = "";
            tableTH();
            data.map(function(row) {
                addChild(table, tableTR(row));
            })
        })
    }
    loadT()
});



//method to create the html to display one row at a time
const tableTR = function(row) {
  //being to set up HTML
  let tr = setUpTableHTML('tr');
  //declare each row to append
  let row1 = setUpTableHTML('td');
  let row2 = setUpTableHTML('td');
  let row3 = setUpTableHTML('td');
  let row4 = setUpTableHTML('td');
  let row5 = setUpTableHTML('td');
  //set the actual value
  row1.innerHTML = row.name;
  row2.innerHTML = row.gender;
  row3.innerHTML = row.age;
  row4.innerHTML = row.goals;
  row5.innerHTML = row.shots;
  //add into the html
  addChild(tr, row1);
  addChild(tr, row2);
  addChild(tr, row3);
  addChild(tr, row4);
  addChild(tr, row5);
  //return the row
  return tr;
};