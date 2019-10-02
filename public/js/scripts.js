////////////// Toggle Visibility ///////////////////
//Toggles hide/show of log in form
function toggleLogin(){
  var loginForm = document.getElementById('loginForm')
  if(loginForm !== null){
    if(loginForm.style.display === 'none'){
      loginForm.style.display = 'inline'
    }
    else{
      loginForm.style.display = 'none'
    }
  }
  else{
    createLoginForm()
  }
}

//Creates login form
function createLoginForm(){
  var html =  "<form action=\"\" class=\"loginForm\" id=\"loginForm\" style=\"display : inline\">"
      html += "<legend>Login</legend>"
      html += "<label for=\"username\">username</label>"
      html += "<input name=\"username\"type=\"text\" id=\"uName\" value=\"username\"><br>"
      html += "<label for=\"pass\">password</label>"
      html += "<input name=\"pass\" type=\"password\" id=\"pass\" value=\"password\"><br>"
      html += "<button type=\"button\" onclick=\"doLogin()\"id=\"loginUser\">Log In</button></form>"
  document.getElementById("Container").innerHTML = ""
  document.getElementById("Container").innerHTML = html
}

//Toggles hide/show of given element ID and associated data needed
function toggleGiven(elementID){
  let givenElt = document.getElementById(elementID)
  if(givenElt !== null){
    givenElt.parentNode.remove()
  }
  else{
    createGiven(elementID)
  }
}

//Creates the element based on the given ID
function createGiven(elementID){
 switch(elementID){
   //Case for viewing all for user
   case "viewAll":
     fetch('/allData', {
       method: 'GET',
       headers: {'Content-Type': 'application/json'},
     })
       .then(function(res){
       return res.json()
     }).then(function(fin){
       emptyBody()
       let dataArray = fin
       var html = "<table id=\"viewAll\">"
       html += "<tr><th>First Name</th><th>Last Name</th><th>Month</th><th>Day</th><th>Sign</th><th>User</th></tr>"
       dataArray.forEach(function (single){
         html += "<tr>"
         html += "<td>" + single.fName + "</td>"
         html += "<td>" + single.lName + "</td>"
         html += "<td>" + single.month + "</td>"
         html += "<td>" + single.day + "</td>"
         html += "<td>" + single.sign + "</td>"
         html += "<td>" + single.user + "</td>"
         html += "</tr>"
       })
       html += "</table>"
       var tableDiv = document.createElement('div')
       tableDiv.innerHTML = html
       document.body.appendChild(tableDiv)
     })
     break
   case "viewDataForUser":
     fetch('/allDataForUser', {
       method: 'GET',
       headers: {'Content-Type': 'application/json'},
     }).then(function(res){
       return res.json()
     }).then(function(fin){
       emptyBody()
       let dataArray = fin
       var html = "<table id=\"viewDataForUser\">"
       html += "<tr><th>First Name</th><th>Last Name</th><th>Month</th><th>Day</th><th>Sign</th><th>User</th></tr>"
       dataArray.forEach(function (single){
         html += "<tr>"
         html += "<td>" + single.fName + "</td>"
         html += "<td>" + single.lName + "</td>"
         html += "<td>" + single.month + "</td>"
         html += "<td>" + single.day + "</td>"
         html += "<td>" + single.sign + "</td>"
         html += "<td>" + single.user + "</td>"
         html += "</tr>"
       })
       html += "</table>"
       var tableDiv = document.createElement('div')
       tableDiv.innerHTML = html
       document.body.appendChild(tableDiv)
     })
     break
   case "viewAddData":
     emptyBody()
     var html = "<form id=\"viewAddData\">"
     html += "<legend>Add Data</legend>"
     html += "<label for=\"fName\">First Name</label>"
     html += "<input name=\"fName\"type=\"text\" id=\"fName\" value=\"First Name\"><br>"
     html += "<label for=\"lName\">Last Name</label>"
     html += "<input name=\"lName\"type=\"text\" id=\"lName\" value=\"Last Name\"><br>"
     html += "<label for=\"month\">Month</label>"
     html += monthToHTML("January")
     html += daysToHTML("January", 1)
     html += "<div id=\"buttonDiv\">"
     html += "<button type=\"button\" onclick=\"addData()\"id=\"submitAddData\">Submit</button>"
     html += "<button type=\"button\" onclick=\"cancelChange()\"id=\"cancel\">Cancel</button></div>"
     html += "</form>"
     var formDiv = document.createElement('div')
     formDiv.innerHTML = html
     document.body.appendChild(formDiv)
     break
   case "viewDataMenu":
     fetch('/allDataForUser', {
       method: 'GET',
       headers: {'Content-Type': 'application/json'},
     }).then(function(res){
       return res.json()
     }).then(function(fin){
       emptyBody()
       let dataArray = fin
       var html = "<form id=\"viewDataMenu\">"
       if(dataArray.length > 0){
         html += "<select id=\"viewDataMenuDropdown\">"
         dataArray.forEach(function (single, index){   
           html += "<option value=\"" + index + "\">"
           html += index + " "
           html += single.fName + " "
           html += single.lName + " "
           html += single.month + " "
           html += single.day + " "
           html += "</option>"
         })
         dataArray.forEach(function (single, index){   
           html += "</select>"
           html += "<p style=\"display: none\" id=\"" + index + "\">"
           html += JSON.stringify(single)
           html += "</p>"
         })
       }
       html += "<div id=\"buttonDiv\"><button onclick=\"toggleGiven(\'viewAddData\')\" type=\"button\"id=\"addEntry\">Add Entry</button>"
       html += "<button onclick=\"toggleGiven(\'viewModifyData\')\"type=\"button\"id=\"modifyEntry\">Modify Entry</button>"
       html += "<button onclick=\"removeData()\"type=\"button\"id=\"deleteEntry\">Delete Entry</button></div>"
       html += "</form>"
       var formDiv = document.createElement('div')
       formDiv.innerHTML = html
       document.body.appendChild(formDiv)
     })
     break
   case "viewModifyData":
     var originalData = JSON.parse(document.getElementById(document.getElementById('viewDataMenuDropdown').selectedIndex).innerHTML)
     emptyBody()
     var html = "<form id=\"viewModifyData\">"
     html += "<label for=\"fName\">First Name</label>"
     html += "<input id=\"fName\" type=\"text\" value=\"" + originalData.fName + "\"></input>"
     html += "<label for=\"lName\">Last Name</label>"
     html += "<input id=\"lName\" type=\"text\" value=\"" + originalData.lName + "\"></input>"
     html += "<label for=\"month\">Month</label>"
     html += monthToHTML(originalData.month)
     console.log(originalData.day)
     html += daysToHTML(originalData.month, originalData.day)
     html += "<div id=\"buttonDiv\">"
     html += "<button type=\"button\" onclick=\"modifyData()\">Submit</button>"
     html += "<button type=\"button\" onclick=\"cancelChange()\"id=\"cancel\">Cancel</button></div>"
     html += "<p id=\"originalData\"style=\"display: none\">"
     html += JSON.stringify(originalData)
     html += "</p>"
     html += "</form>"
     var editDiv = document.createElement('div')
     editDiv.innerHTML = html
     document.body.appendChild(editDiv)
     break
   case "viewUserMenu":
     fetch('/allUsers', {
       method: 'GET',
       headers: {'Content-Type': 'application/json'},
     }).then(function(res){
       return res.json()
     }).then(function(fin){
       emptyBody()
       let dataArray = fin
       var html = "<form id=\"viewUserMenu\">"
       if(dataArray.length > 0){
         
       }
       html += "<select id=\"viewUserMenuDropdown\">"
       dataArray.forEach(function (single, index){
         html += "<option value=\"" + index + "\">"
         html += index + " "
         html += single.username + " "
         html += "</option>"
       })
       dataArray.forEach(function (single, index){  
         html += "</select>"
         html += "<p style=\"display: none\" id=\"" + index + "\">"
         html += JSON.stringify(single)
         html += "</p>"
       })
       html += "<div id=\"buttonDiv\"><button onclick=\"toggleGiven(\'viewAddUser\')\" type=\"button\"id=\"addUser\">Add User</button>"
       html += "<button onclick=\"toggleGiven(\'viewModifyUser\')\"type=\"button\"id=\"modifyUser\">Modify User</button>"
       html += "<button onclick=\"removeUser()\" type=\"button\"id=\"deleteUser\">Delete User</button></div>"
       html += "</form>"
       var formDiv = document.createElement('div')
       formDiv.innerHTML = html
       document.body.appendChild(formDiv)
     })
     break
   case "viewAddUser":
     emptyBody()
     var html = "<form id=\"viewAddUser\">"
     html += "<legend>Add User</legend>"
     html += "<label for=\"uName\">Username</label>"
     html += "<input name=\"uName\"type=\"text\" id=\"uName\" value=\"username\"><br>"
     html += "<label for=\"pass\">Last Name</label>"
     html += "<input name=\"pass\"type=\"password\" id=\"pass\" value=\"password\"><br>"
     html += "<div id=\"buttonDiv\">"
     html += "<button type=\"button\" onclick=\"addUser()\"id=\"submitAddUser\">Submit</button>"
     html += "<button type=\"button\" onclick=\"cancelChange()\"id=\"cancel\">Cancel</button></div>"
     html += "</form>"
     var formDiv = document.createElement('div')
     formDiv.innerHTML = html
     document.body.appendChild(formDiv)
     break
   case "viewModifyUser":
     var originalData = JSON.parse(document.getElementById(document.getElementById('viewUserMenuDropdown').selectedIndex).innerHTML)
     emptyBody()
     var html = "<form id=\"viewModifyUser\">"
     html += "<legend>Add User</legend>"
     html += "<label for=\"uName\">Username</label>"
     html += "<input name=\"uName\"type=\"text\" id=\"uName\" value=\""+ originalData.username + "\"><br>"
     html += "<label for=\"pass\">Password</label>"
     html += "<input name=\"pass\"type=\"text\" id=\"pass\" value=\"" + originalData.password + "\"><br>"
     html += "<div id=\"buttonDiv\">"
     html += "<button type=\"button\" onclick=\"modifyUser()\">Submit</button>"
     html += "<button type=\"button\" onclick=\"cancelChange()\"id=\"cancel\">Cancel</button></div>"
     html += "<p style=\"display: none\" id=\"originalUser\">"
     html += JSON.stringify(originalData)
     html += "</p>"
     html += "</form>"
     var formDiv = document.createElement('div')
     formDiv.innerHTML = html
     document.body.appendChild(formDiv)
     break
 } 
}

//Empties body of page of all uneeded data
function emptyBody(){
  let body = document.body
  let children = body.childNodes
  var filtered = [].filter.call(children, function(node){ return node.nodeType == 1})
  filtered.forEach(function(node){
    if(node.tagName === 'DIV' && node.id !== 'Container'){
      node.remove()
    }
  })  
}

//Serves as general cancel button for admin page
function cancelChange(){
  emptyBody()
}

///////////// UTILITY //////////////////////////////////////
//Gets name of user from cookie
function getCookie(name){
  var re = new RegExp(name + "=([^;]+)")
  var val = re.exec(document.cookie)
  return (val != null) ? unescape(val[1]) : null 
}

function generateRandomArrayHoroscope(){
  let randArray = []
  for(let i = 0; i< 6; i++){
    randArray.push(Math.floor(Math.random() * (4)))
  }
  return randArray
}

///////////// Data DB functions /////////////////////////////
//ADD
function addData(){
  let body = {
    fName: document.getElementById('fName').value,
    lName: document.getElementById('lName').value,
    month: document.getElementById('monthDropdown').value,
    day: document.getElementById('dayDropdown').value,
    user: getCookie('TestCookie')
  }
  let json = JSON.stringify(body)
  fetch('/addData', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: json
  })
  .then(function(res){
    console.log(res)
    if(res.status === 200){
      window.alert("Successfully added to database")
      emptyBody()
    }
    else{
      window.alert("Data already exists!\nNot added to database!")
    }
  })
}

//MODIFIY
function modifyData(){
  let newData = {
    fName: document.getElementById('fName').value,
    lName: document.getElementById('lName').value,
    month: document.getElementById('monthDropdown').value,
    day: document.getElementById('dayDropdown').value,
    user: getCookie('TestCookie')
  }
  let oldData = JSON.parse(document.getElementById('originalData').value)
  let body = {original: oldData, changed: newData}
  let json = JSON.stringify(body)
  fetch('/modifyData', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: json
  })
  .then(function(res){
    console.log(res)
    if(res.status === 200){
      window.alert("Successfully modified")
      emptyBody()
    }
  })
}

//DELETE
function removeData(){
  let body = JSON.parse(document.getElementById('originalData').value)
  let json = JSON.stringify(body)
  fetch('/removeData', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: json
  })
  .then(function(res){
    console.log(res)
    if(res.status === 200){
      window.alert("Successfully removed!")
      emptyBody()
    }
  })
}

//////////// User DB functions ////////////////////////////
//ADD
function addUser(){
  let body = {
    username: document.getElementById('uName').value,
    password: document.getElementById('pass').value
  }
  let json = JSON.stringify(body)
  fetch('/addUser', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: json
  })
  .then(function(res){
    console.log(res)
    if(res.status === 200){
      window.alert("Successfully added to database")
      emptyBody()
    }
    else{
      window.alert("Data already exists!\nNot added to database!")
    }
  })
}

//MODIFY
function modifyUser(){
  let newData = {
    username: document.getElementById('uName').value,
    password: document.getElementById('pass').value
  }
  let oldData = JSON.parse(document.getElementById('originalUser').innerHTML)
  let body = {original: oldData, changed: newData}
  let json = JSON.stringify(body)
  fetch('/modifyUser', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: json
  })
  .then(function(res){
    console.log(res)
    if(res.status === 200){
      window.alert("Successfully modified")
      emptyBody()
    }
  })
}

//DELETE
function removeUser(){
  var currIndex = document.getElementById("viewUserMenuDropdown").selectedIndex
  var userData = JSON.parse(document.getElementById(currIndex).innerHTML)
  let currUser = getCookie('TestCookie')
  if(currUser === userData.username){
     window.alert("CANNOT DELETE CURRENT USER")
  }
  else{
    let json = JSON.stringify(userData)
    fetch('/removeUser', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: json
    })
      .then(function(response){
        window.alert("User Deleted")
        emptyBody()
    })
  }
}

////////// Horoscope DB function ////////////////////////
function generateHoroscope(){
  let vals = generateRandomArrayHoroscope()
  let a,b,c,d,e,f = ""
  fetch('/horoscopeData', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  })
  .then(function(response){
    return response.json()
  })
  .then(function(final){
    console.log(final)
    a = final.gerund[vals[0]]
    b = final.adjective[vals[1]]
    c = final.noun[vals[2]]
    d = final.pluralNoun[vals[3]]
    e = final.adjective[vals[4]]
    f = final.verb[vals[5]]
    var html =  "Friends are more sold on a " + a + 
          " prospect than you are, which is great because you could sure use the re-assurance. Don't be discouraged by a loved one's " + b + 
          " response.  Persevere because what you have to say needs to be heard.You could sure use someone in your " + c + 
          " however it's not a yes-man you need, but someone who will challenge your most cherished notions. Don't let " + d + 
          " talk you out of what you feel is " + e + 
          ".  You know they mean well, but their advice is based on what's best for them and not for you. It took a while to " + f + 
          " that you made a mistake, but now that you see it for what it is you'll move heaven and earth to do the right thing.";
    document.getElementById("Container").innerHTML = ""
    document.getElementById("Container").innerHTML = html
  })
}




//////// Log in/out ////////////////
//Logs user out
function logOut(){
  let result = window.confirm("Are you sure you wish to log out?")
  if(result){
    fetch('/logout', {
      method:'GET',
      headers: {'Content-Type': 'application/json'},
    })
      .then(function(res){
      window.location = res.url
    })
  }
}

//Runs login function
function doLogin(){
  let uName = document.getElementById("uName").value
  let pass = document.getElementById("pass").value
  let body = {username: uName, password: pass}
  body = JSON.stringify(body)
  fetch('/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body
  })
  .then(function(res){
    if(res.status === 200){
      window.location = res.url
    }
    else{
      window.alert("Incorrect Username or Password!\nTry again!")
    }
  })
}

///////////////// HADNLES DYNAMIC DATE INFO
function removeAllOptions(selection, removalGroup){
  var len, groups, par;
  if(removalGroup){
    groups = selection.getElementsByTagName('option')
    len = groups.length;
    for(var i = len; i; i--){
      selection.removeChild(groups[i-1])
    }
  }
  len = selection.options.length
  for(var i=len; i; i--){
    par = selection.options[i-1].parentNode;
    par.removeChild(selection.options[i-1])
  }
}

function updateDays(){
  let currentMonth = document.getElementById('monthDropdown').value
  let monthNum = monthToNum(currentMonth)
  let numDays = hasDays(monthNum)
  let selection = document.getElementById("dayDropdown")
  removeAllOptions(selection, true)
  appendDaysToSelect(selection, numDays)
}

function appendDaysToSelect(selection, numDays){
  for(let i = 1; i<= numDays; i++){
    var opt = document.createElement("option")
    opt.innerHTML = i
    opt.value = i
    selection.appendChild(opt)
  }
}

function daysToHTML(month, day){
  let totalDays = hasDays(monthToNum(month));
  let html = "<label for=\"days\">Day of Birth</label>"
  html += "<select name=\"days\" id=\"dayDropdown\">"
  for(let i = 1; i <= totalDays; i++){
    html += "<option "
    if(i == day){
      console.log("SELECTED")
      html += "selected=\"selected\" "
    }
    html += "value=\"" + i + "\">"+ i + "</option>"
  }
  html += "</select><br>"
  return html;
}

function monthToNum(month){
  switch(month){
    case "January":
      return 0;
    case "February":
      return 1;
    case "March":
      return 2;
    case "April":
      return 3;
    case "May":
      return 4;
    case "June":
      return 5;
    case "July":
      return 6;
    case "August":
      return 7;
    case "September":
      return 8;
    case "October":
      return 9;
    case "November":
      return 10;
    case "December":
      return 11;
  }
}

function hasDays(month){
  switch(month){
    case 0:
      return 31;
    case 1:
      return 29;
    case 2:
      return 31;
    case 3:
      return 30;
    case 4:
      return 31;
    case 5:
      return 30;
    case 6:
      return 31;
    case 7:
      return 31;
    case 8:
      return 30;
      break;
    case 9:
      return 31;
    case 10:
      return 30;
    case 11:
      return 31;
  }
}

const DateDataForDropdown = {
  'days' : {
    January:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
    February:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'],
    March:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
    April:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30' ],
    May:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
    June:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30' ],
    July:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
    August:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ]      ,
    September:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30' ]    ,
    October:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ]      ,
    November:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
    December:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ]      
  }
}

const MonthDataForDropdown = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

function monthToHTML(month){
  let html = "<select onchange=\"updateDays()\"name=\"month\" id=\"monthDropdown\">"
  switch(month){
    case "January":
      html += "<option selected=\"selected\" value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "February":
      html += "<option value=\"January\">January</option>"
      html += "<option selected=\"selected\" value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "March":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option selected=\"selected\" value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "April":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option selected=\"selected\" value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "May":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option selected=\"selected\" value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "June":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option selected=\"selected\" value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "July":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option selected=\"selected\" value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "August":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option selected=\"selected\" value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "September":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option selected=\"selected\" value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "October":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option selected=\"selected\" value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "November":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option selected=\"selected\" value=\"November\">November</option>"
      html += "<option value=\"December\">December</option></select><br>"
      return html;
    case "December":
      html += "<option value=\"January\">January</option>"
      html += "<option value=\"February\">February</option>"
      html += "<option value=\"March\">March</option>"
      html += "<option value=\"April\">April</option>"
      html += "<option value=\"May\">May</option>"
      html += "<option value=\"June\">June</option>"
      html += "<option value=\"July\">July</option>"
      html += "<option value=\"August\">August</option>"
      html += "<option value=\"September\">September</option>"
      html += "<option value=\"October\">October</option>"
      html += "<option value=\"November\">November</option>"
      html += "<option selected=\"selected\" value=\"December\">December</option></select><br>"
      return html;
  }
}