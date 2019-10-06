const login = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    
    const input = document.querySelector( '#username1' ),
          input2 = document.querySelector('#password1'),
          
          json = { username: input.value,
                  password: input2.value
                 },
          body = JSON.stringify( json );
    
    fetch( '/login', {
      method:'POST',
      body
    })
    .then(function(response){
      
        return response.text()//}
    })
       
    .then(function(response){
      if(response.length!== 40){ //the length of user/password not found
        window.open("index2.html", "_self" );
        console.log(response);
      }else{
          alert(response);
          }})
  
    //clears the input boxes when the user clicks the button
    document.getElementById('username1').value = '';
    document.getElementById('password1').value = '';
  
    return false
  
}

const createAccountFn = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()
    
    let id =0;
  
    const input = document.querySelector( '#firstName' ),
          input2 = document.querySelector('#lastName'),
          input3 = document.querySelector('#username'),
          input4 = document.querySelector('#password'),
          
          json = { firstName: input.value,
                  lastName: input2.value,
                  username:input3.value,
                  password:input4.value
                 },
          body = JSON.stringify( json );
          
    fetch( '/createAccount', {
      method:'POST',
      body 
    })
    .then( function( response ) {
      
      return response.text()
    })
    .then(function(response){
      
        window.open("index2.html", "_self" );
          })
  
    //clears the input boxes when the user clicks the button
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  
    return false
  }

 window.onload = function() {
    const loginBtn = document.querySelector( "#loginBtn" );
    const createAccountBtn = document.querySelector( "#createAccountBtn");
    loginBtn.onclick = login;
    createAccountBtn.onclick = createAccountFn;
  }