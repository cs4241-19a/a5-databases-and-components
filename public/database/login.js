const login = function( e ) {
    console.log("ATTEMPTING LOGIN");
    console.log(document.querySelector('#email').value);
    // prevent default form action from being carried out
    e.preventDefault();
    const body = JSON.stringify({ username: document.querySelector('#email').value, password: document.querySelector('#password').value});
    console.log(body);
    fetch( '/loginAttempt', {
        method:'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' }
    })
        .then( function( response ) {
            console.log(response.url);
            window.open (response.url,'_self',false)
            // fetch( response.url, {
            //     method:'GET'
            // });

            // document.getElementById('loginNotification').style.display = "flex";
            // if(response["id"] === "baduser")
            // {
            //     document.getElementById('loginNotification').innerText = "Could not find user + " + body["email"];
            // }else{
            //     document.getElementById('loginNotification').innerText = "Logged in, welcome " + response["name"] + ". Moving to store page...";
            //     window.location.href = response.url;
            // }
    });
};