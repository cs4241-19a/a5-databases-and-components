const login = function( e ){
    // prevent default form action from being carried out
    e.preventDefault();
    const body = JSON.stringify({ email: document.querySelector('#email'), password: document.querySelector('#password') });
    fetch( '/login', {
        method:'POST',
        body: body
    })
        .then( function( response ) {
            document.getElementById('loginNotification').style.display = "flex";
            if(response["id"] === "baduser")
            {
                document.getElementById('loginNotification').innerText = "Could not find user + " + body["email"];
            }else{
                document.getElementById('loginNotification').innerText = "Logged in, welcome " + response["name"] + ". Moving to store page...";
                window.location.href = response.url;
            }
        });
};