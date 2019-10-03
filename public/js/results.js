window.onload = function(e){
  e.preventDefault()
    
  
  fetch('/getResults', {
      method: 'GET'
    }).then(function(response){
      response.json().then((responseData) => {
        console.log(responseData);
        makeTable(responseData);
      })
    })
  
    fetch('/getStuff', {
      method: 'GET'
    }).then(function(response){
      response.json().then((responseData) => {
        console.log(responseData);
        datafill(responseData);
      })
    })
    
    const button2 = document.querySelector('#tryagain');
    button2.onclick = tryagain;
  
    return false;
}

const tryagain = function(){
    location.href="edit";
  }

function datafill(responseData){
    document.getElementById("avgnamelength").innerHTML = "The average name is " + responseData.avgnamelength + " characters long!";
    document.getElementById("avgname").innerHTML = "The average name is: "+ responseData.avgname;
    document.getElementById("avgage").innerHTML = "The average quiz taker's age is: "+responseData.avgage;
    document.getElementById("avgcolor").innerHTML = "The average favorite color is: "+responseData.avgcolor +"!<span style='background:"+responseData.avgcolor+";width:50px;height:16px;border:3px solid #000;display:inline-block;'></span>";
    document.getElementById("avgmood").innerHTML = "The average person taking this suvery is having a " + responseData.avgmood+" out of 5 kind of time";
    document.getElementById("totalUsers").innerHTML = "The total number of users is: " + responseData.totalUsers+"!";
  }

function makeTable(responseData){
  var html = "<tbody><tr><td>First Name</td><td>Last Name</td><td>Birthday</td><td>Favorite Color</td><td>How they are feeling</td></tr>";
  //for(var i =0;i<responseData.length;i++){
    html+="<tr>";
    html+="<td>"+responseData.fname+"</td>";
    html+="<td>"+responseData.lname+"</td>";
    html+="<td>"+responseData.birthday+"</td>";
    html+="<td>RGB"+responseData.color+"<span style='width:50px;height:16px;border:3px solid #000;display:inline-block;background:"+responseData.color+";'></span></td>";
    html+="<td>"+responseData.mood+"</td>";
    var names = {fname:"",lname:""};
    if(responseData.fname != undefined && responseData.lname != undefined)
      names ={fname:responseData.fname.toString(), lname:responseData.lname.toString()};
    names = JSON.stringify(names);
    html+="</tr>";
  //}
  html+="</tbody>"
  document.getElementById("tabletime").innerHTML = html;
}
