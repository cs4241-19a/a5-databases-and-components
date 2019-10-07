// client-side js
// run by the browser each time your view template is loaded

async function showAll(){

    try{
      const response = await fetch('/tickets');
          
      const data = await response.json();
      const tickets = data;
      
      //const user = await fetch('/user');
      //const userdata = await user.json();
      //const name = userdata.user;
      var table = document.getElementById("ticketboard");
      var i;
      var k;
      var ticketsToShow = [];
      
      for(i=0; i<data.length; i++){
        let index = i;
          ticketsToShow.push(data[i]);
      }
      
      
      for (i=0; i<ticketsToShow.length; i++){

        var tableRow = table.insertRow(1);
        var tCell2 = tableRow.insertCell(0);
        var tCell3 = tableRow.insertCell(1);
        var tCell4 = tableRow.insertCell(2);
        var tCell5 = tableRow.insertCell(3);
        var tCell6 = tableRow.insertCell(4);
        var tCell7 = tableRow.insertCell(5);          
        var modifyBtn = document.createElement("input");
        var deleteBtn = document.createElement("input");
        let index = i;
        modifyBtn.type="button";
        modifyBtn.value="Modify";
        deleteBtn.type="button";
        deleteBtn.value="Delete";
        modifyBtn.addEventListener("click", function() {
        modPage(ticketsToShow[index])});
        deleteBtn.addEventListener("click", function() {
        deleteOrder(ticketsToShow[index])});
          //<td> <button type="button" id="modifyBtnLol" class="modify">Modify</button></td>
          //<td> <button type="button" id="deleteBtn" class="modify">Delete</button></td>
        tCell2.innerHTML = ticketsToShow[i].fish;
        //tCell2.contentEditable = "true";
        tCell3.innerHTML = ticketsToShow[i].style;
        //tCell4.contentEditable = "true";
        tCell4.innerHTML = ticketsToShow[i].amount;
        tCell5.innerHTML = ticketsToShow[i].price;
        tCell6.append(modifyBtn);
        tCell7.append(deleteBtn);
        //console.log(data.tickets[index]);
      }
      
   } catch(error){
     console.log("oopsie error");
      console.log(error);
      }
    
    
  }

function modPage(order){
  console.log(order._id);
  document.getElementById("showAllOrder").style.display = "none";
  document.getElementById("modOrderForm").style.display = "block";
  
  document.getElementById("yourname").value = order.name;
    document.getElementById("phone").value = order.phone;
          if( order.fish === 'tuna'){
            document.getElementById('tuna').checked = true;
          }
          if(order.style === 'sashimi'){
            document.getElementById('sashimi').checked = true;
          }
          document.getElementById("number-order").value = order.amount;
          document.getElementById('orderID').value = order._id;
  
}

async function modifyOrder(order){
   const body = JSON.stringify(order);
  try{
    await fetch('/modify', {
    method:'POST',
    body,
    headers: { "Content-Type": "application/json"}

  });
  }catch(e){
    console.log(e);
  }
}
async function deleteOrder(order){
  const body = JSON.stringify(order);
  try{
    await fetch('/delete', {
    method:'POST',
    body,
    headers: { "Content-Type": "application/json"}

  });
  }catch(e){
    console.log(e);
  }
  
}
const submitForm = async function( e ) {
    // prevent default form action from being carried out
    e.preventDefault();
      const response = await fetch('/tickets');          
      const data = await response.json();
      const orderid = data[data.length]._id;
    const incomingOrder = {
      name: document.getElementById('yourname').value,
      phone: document.getElementById('phone').value,
      fish: document.querySelector('input[name="fish"]:checked').value,
      style: document.querySelector('input[name="style"]:checked').value,
      amount: document.getElementById('number-order').value
    };
    console.log(orderid);
    const body = JSON.stringify( incomingOrder );
    
    fetch( '/submit', {
      method:'POST',
      body 
    })
    

    return false;
  }




/*
// define variables that reference elements on our page
const dreamsList = document.getElementById('dreams');
const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements['dream'];

// a helper function that creates a list item for a given dream
const appendNewDream = function(dream) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = dream;
  dreamsList.appendChild(newListItem);
}

// iterate through every dream and add it to our page
dreams.forEach( function(dream) {
  appendNewDream(dream);
});

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get dream value and add it to the list
  dreams.push(dreamInput.value);
  appendNewDream(dreamInput.value);

  // reset form 
  dreamInput.value = '';
  dreamInput.focus();
};
*/