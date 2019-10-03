const login = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const username = document.querySelector( '#inputUsername' ),
          password = document.querySelector( '#inputPassword' ),
          json = { username: username.value, 
                   password: password.value,
                  },
          body = JSON.stringify( json )

    if(username.value === '' || password.value === ''){
      console.log('missing input')
      document.querySelector( '#blankInputBox' ).removeAttribute('hidden');
      return false;
    }

    console.log(body)
    fetch( '/login', {
        method:'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' }
      }).then(function(response) {
          if(response.status == 401){
              console.log('unauthorized');
              document.querySelector( '#invalidLoginBox' ).removeAttribute('hidden');
              return false;
          } else {
            console.log(response);
            let json = response.json();
            window.location = '/'
          }
      })


    return false
  }

  const create = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const username = document.querySelector( '#inputUsernameCreate' ),
          password = document.querySelector( '#inputPasswordCreate' ),
          json = { username: username.value, 
                   password: password.value,
                  },
          body = JSON.stringify( json )

    if(username.value === '' || password.value === ''){
      console.log('missing input')
      document.querySelector( '#blankInputBox' ).removeAttribute('hidden');
      return false;
    }

    console.log(body)
    fetch( '/createAccount', {
        method:'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' }
      }).then(function(response) {
        if(response.status == 409){
              console.log('unauthorized');
              document.querySelector( '#invalidUsernameBox' ).removeAttribute('hidden');
              return false;
          } else {
            fetch( '/login', {
              method:'POST',
              body: body,
              headers: { 'Content-Type': 'application/json' }
            }).then(function(response) {
                  window.location = '/'
            })
          }
      })


    return false
  }

  window.onload = function() {
    const loginButton = document.querySelector( '#login' )
    loginButton.onclick = login
    const createButton = document.querySelector( '#create' )
    createButton.onclick = create
  }