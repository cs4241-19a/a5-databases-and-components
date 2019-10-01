window.onload = function(){
    const signButton = document.getElementById('signin')
    signButton.onclick = signin;
  }

const signin = function(e){
    //console.log("hello - before")
    e.preventDefault()

    const body = JSON.stringify({
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value
      })
     console.log(username);
     console.log(password);
      console.log(body);
    
      fetch('/home', {
        method:'POST',
        //body:JSON.stringify({ username:'charlie', password:'charliee' }),
        body,
        headers: { 'Content-Type': 'application/json' }
      })
      .then(function(res){
          console.log("hello" , res.url)
          window.location.assign(res.url)
      })
      //.then( res => res.json() )
      /*
      .then( e => {
        if(e){
          location.path = '/home.html';
        }
      })
      */
    
      fetch( '/test', {
      method:'POST',
      credentials: 'include'
    })
    .then( console.log )
    .catch( err => console.error ) 
    
}
