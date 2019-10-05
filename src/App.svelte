<script>
    function submit(e) {
        e.preventDefault()
        const inputText = document.getElementById('inputAssignment').value
        const inputDate = document.getElementById('inputDate').value
        const json = {Note: inputText, Date: inputDate}
        postData(json, 'submit')
    }

    function postData(json, path) {
        (async () => {
            const rawResponse = await fetch(path, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
            })
            const content = await rawResponse.json()
            handleData(content)
        })()
    }

    function handleData(data) {
        let container = document.getElementById("notesContainer").innerHTML="";
        let id = 1
        data.forEach(function (item, index, array) {
            let note = document.createElement("li")
            note.innerHTML = createInnerHTML(item, id)
            note = setClassName(note, item, id)
            id++
            document.getElementById("notesContainer").insertAdjacentElement('beforeend', note)
        })
    }

    function setClassName(note, item, id) {
        if (item.Days <= 5) {
            note.className = "list-group-item d-flex list-group-item-danger item-" + id + " justify-content-between"
        } else {
            note.className = "list-group-item d-flex list-group-item-success item-" + id + " justify-content-between"
        }
        return note
    }

    function createInnerHTML(item, id) {
        let itemId = "\"" + item._id + "\""
        return "<p class='p-0 m-0 flex-grow-1' id='item-" + id + "'>" +
            item.Note +
            " due: " + item.Date +
            " days: " + item.Days +
            "</p>" +
            "<button class='btn btn-success mr-1' on:click={editItem(" + id + "," + itemId + ")}>edit</button>" +
            "<button class='btn btn-danger' on:click={deleteItem(" + itemId + ")}>delete</button>"
    }

    function editItem(id, itemId) {
        let elems = document.getElementsByTagName('*'), i
        for (i in elems) {
            if ((' ' + elems[i].className + ' ').indexOf(' ' + "item-" + id + ' ')
                > -1) {
                elems[i].innerHTML = createInnerEditHTML(id, itemId)
            }
        }
    }

    function createInnerEditHTML(id, itemId) {
        itemId = "\"" + itemId + "\""
        return "<input type='text' class='form-control col-4' id='newAssignment-" + id + "' value='" + getOldAssignmnet(id) + "'>" +
            "<input type='date' class='form-control col-4' id='newDate-" + id + "' >" +
            "<button class='btn btn-success col-2' onClick='saveItem(" + id + "," + itemId + ")'>save</button>" +
            "</div"
    }

    function saveItem(id, itemId) {
        const newAssignment = document.getElementById('newAssignment-' + id).value
        const newDate = document.getElementById('newDate-' + id).value
        const json = {Id: itemId, Note: newAssignment, Date: newDate}
        postData(json, 'update')
    }

    function getOldAssignmnet(id) {
        let innerHTML = document.getElementById('item-' + id).html()
        console.log(innerHTML)
        return innerHTML.split("due:", 1)
    }

    function deleteItem(id) {
        const json = {Item: id}
        postData(json, 'delete')
    }

    function createDate(date) {
        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
        let dateArray = date.split('-')
        return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).toLocaleDateString("en-US", options)
    }
    document.onload = postData({}, 'refresh')
</script>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                   aria-haspopup="true" aria-expanded="false"></a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item disabled" href="/dashboard">Dashboard (WIP)</a>
                    <a class="dropdown-item" href="/logout">Logout</a>
                </div>
            </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-primary my-2 my-sm-0" type="button"
                    onclick="alert('Search not implemented yet')">Search
            </button>
        </form>
    </div>
</nav>
<div class="container text-center">
    <img class="profile mt-2"
         src="images/noteLogo.png"
         alt="Application Logo">
    <br>
    <h1 class="display-3">
        Hi
    </h1>
    <h3>
        <small class="text-muted">I'm your assignments app</small>
    </h3>
</div>
<div class="container mt-3">
    <form action="">
        <div class="row justify-content-around">
            <div class="form-group">
                <label for="inputAssignment">Assignment Content</label>
                <input type="text" class="form-control col-12" id="inputAssignment" aria-
                       placeholder="Enter Assignment">
            </div>
            <div class="form-group">
                <label for="inputDate">Date</label>
                <input type="date" class="form-control col-12" id="inputDate" aria- placeholder="Enter Assignment">
            </div>
            <div class="w-100"></div>
            <button id="add" class="btn btn-primary col-6" on:click={submit}>Submit</button>
        </div>
    </form>
</div>
<div class="container">
    <ul class="list-group mt-3" id="notesContainer"></ul>
</div>