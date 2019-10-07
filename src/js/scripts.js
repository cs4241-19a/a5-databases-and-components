function login() {

    const json = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    }
    const body = JSON.stringify(json)

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })
    //.then(res => res.json())
    // .then(function(msg) {
    //     console.log(msg)
    // })

    .then(function(res) {
        if (res.status === 200) {
            fetch('/index', {
                method: 'GET',
                credentials: 'include'
            })
            .then(function(resp) {
                window.location.href = resp.url;
            })
        } else {
            let pwd = document.querySelector('#password')
            pwd.classList.add("border-red-500");
            document.querySelector('#bad-pwd').hidden = false;
        }
    })
}

function signup(self, e) {
    e.preventDefault();
    let parent = self.parentNode;
    let row = parent.parentNode;
    let btn = parent.querySelector('#signup-btn');

    const json = {
        tripname: row.querySelector('#tripname').innerHTML,
        dates: row.querySelector('#dates').innerHTML,
        gear: row.querySelector('#gear').value,
        paid: row.querySelector('#paid-check').checked,
    }
    const body = JSON.stringify(json);

    fetch ('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body
    }).then(res => res.json())
    .then(function(msg) {
        if (msg.message === "added") {
            row.style.transition = "background-color 0.2s ease"
            row.style.backgroundColor = "#D0FFD6"
            btn.style.background = "#FC5C7D";
            btn.innerHTML = "Remove";
        } else if (msg.message === "removed") {
            row.style.transition = "background-color 0.2s ease"
            row.style.backgroundColor = "white"
            btn.style.background = "linear-gradient(90deg, #FC5C7D, #6A82FB) center center fixed";
            btn.innerHTML = "Sign up"
        }
    })
}

function paidCheck(self) {
    this.checked = !this.checked; 

    const row = self.parentNode.parentNode.parentNode.parentNode;

    const json = {
        tripname: row.querySelector('#tripname').innerHTML,
        paid: this.checked
    }
    const body = JSON.stringify(json);
    
    fetch('/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body
    })
}

function gearSelect(self) {
    const row = self.parentNode.parentNode.parentNode;
    console.log(row.querySelector('#tripname').innerHTML)
    const json = {
        tripname: row.querySelector('#tripname').innerHTML,
        gear: self.value
    }
    const body = JSON.stringify(json);

    fetch('/gear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body
    })
}

function resultsData() {
    fetch('/resultsData', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(function(results) {
        document.querySelector('#results-div').innerHTML = JSON.stringify(results, undefined, 2)
    })
}

async function results() {
    fetch('/results', {
        method: 'GET',
        credentials: 'include'
    })
    .then(function(req) {
        window.location.href = req.url
    })
}

function rememberTrips() {
    const list = document.querySelectorAll('#tripname');

    fetch('/trips', {
        method: 'POST',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(function(json) {
        let trips = JSON.parse(json);
        console.log(trips)
        list.forEach(t => {
            trips.forEach(i => {
                if (t.innerHTML === i.tripname) {
                    let row = t.parentNode;
                    let btn = row.querySelector('#signup-btn');
                    let gear = row.querySelector('#gear');
                    let paid = row.querySelector('#paid-check');
                    row.style.backgroundColor = "#D0FFD6";
                    btn.style.background = "#FC5C7D";
                    btn.innerHTML = "Remove";
                    gear.value = i.gear;
                    paid.checked = i.paid;
                }
            })
        })
    })

        // .then(function(msg) {
    //     const list = document.querySelectorAll('#tripname');
    //     list.forEach(function(t) {
    //         msg.forEach(i => {
    //             console.log(t.innerHTML, i)
    //         })
    //     })
        
    // })
}