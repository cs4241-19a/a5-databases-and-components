<script>
  export let name;
  import ExampleCapsules from "./list.svelte";
  import Navbar from "./navbar.svelte";


  const loginUser = function(e){
  e.preventDefault();
  const name = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  console.log(JSON.stringify({username: name, password: pass}));
fetch( '/login', {
      method:'POST',
      body:JSON.stringify({ username: name, password: pass}),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json())
    .catch(e => console.log(e.text()))
    .then(f => {
      if(f.status == "correct login" || "new user created"){
      }
      else{
        alert("Incorrect login, try again");
      }
	})	
  }
</script>


<body>

  <Navbar />

  <h1 class="welcome">Welcome!</h1>
  <form class="login" action="">
    <input type="text" placeholder="Username" class="field" id='username' />
    <input type="password" placeholder="Password" class="field" id='password'/>
	<button on:click={loginUser} class="button">Login</button>
  </form>


  <form class='login' id='submit' action="">
  <input type="text" placeholder="memories" class="field" id="entry">
  <button on:click={submit} class="button">Submit!</button>
  </form>

  <ExampleCapsules />

  <style>
    html {
      box-sizing: border-box;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #f3e1dd;
    }

    .field {
      border-width: 0px;
      max-width: 50%;
      align-self: center;
    }
    .button {
      border-width: 0px;
    }
    .button:hover {
      background-color: #cc7178;
      color: white;
    }

    .login {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .welcome {
      text-align: center;
      padding: 50px;
    }
  </style>
</body>
