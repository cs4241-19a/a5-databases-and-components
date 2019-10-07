const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    var body;

    const inputName = document.querySelector( '#userName'),
        inputFName = document.querySelector( '#FName'),
        selectColor = document.querySelector('#color'),
        boardName = document.querySelector('#board'),
        json = { name: inputName.value, fullname: inputFName.value, Color: selectColor.value, Board: boardName.value }

    const signName = document.querySelector('#userN'),
        signBoard = document.querySelector('#boardName'),
        jsonSign = { name: signName.value, Board: signBoard.value }

    window.localStorage;

    if(inputName.value === '' && signName.value !== '') {
        body = JSON.stringify( jsonSign )
        localStorage.setItem('myName', signName.value)
        localStorage.setItem('myBoard', signBoard.value)

        showToast({
            str: "Authenticating User",
            time: 2000,
            position: 'bottom'
        });

        fetch( '/login', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        })
            .then( function( response ) {
                console.log(response.status);
                if(response.status === 200) {
                    showToast({
                        str: "Successfully Authenticated",
                        time: 2000,
                        position: 'bottom'
                    });
                    console.log("post response: ", response)
                    window.location = "/task.html"
                } else if(response.status === 401) {
                    showToast({
                        str: "Authentication Failed",
                        time: 2000,
                        position: 'bottom'
                    });
                    console.log("post response: ", response)
                }  else {
                    showToast({
                        str: "Unknown Error",
                        time: 2000,
                        position: 'bottom'
                    });
                    console.log("post response: ", response)
                }
            })

    } else if(inputName.value !== '' && signName.value === '') {
        body = JSON.stringify( json )
        localStorage.setItem('myName', inputName.value)
        localStorage.setItem('myBoard', boardName.value)

        fetch( '/submit', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        })
            .then( function( response ) {
                showToast({
                    str: "Creating Board",
                    time: 2000,
                    position: 'bottom'
                });
                console.log( "post response: ", response )
                window.location = "/task.html"
            })

    } else {
        console.log('error')
    }

    return true
}

const res = function( e ) {
    e.preventDefault();
    window.location = "/results.html"
    return true
}


window.onload = function() {
    const button = document.getElementById('continueBtn')
    button.onclick = submit

    const button1 = document.getElementById('resBtn')
    button1.onclick = res
}