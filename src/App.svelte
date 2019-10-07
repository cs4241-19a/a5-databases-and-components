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

    const getAssignments = function(){
        const p = fetch( '/refresh', {
            method:'GET'
        })
            .then( response => response.json() )
            .then( json => {
                return json
            })
    }
    function editItem(id) {
        let elems = document.getElementsByTagName('*'), i
        for (i in elems) {
            if ((' ' + elems[i].className + ' ').indexOf(' ' + "item-" + id + ' ')
                > -1) {
                elems[i].innerHTML = createInnerEditHTML(id)
            }
        }
    }

    function createInnerEditHTML(id) {
        return "<input type='text' class='form-control col-4' id='newAssignment-" + id + "' value='" + getOldAssignment(id) + "'>" +
            "<input type='date' class='form-control col-4' id='newDate-" + id + "' >" +
            "<button class='btn btn-success col-2' on:click='{saveItem(" + id + "," + itemId + ")}'>save</button>" +
            "</div"
    }

    function getOldAssignment(id) {
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

    let assignments = getAssignments()
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
    {#await assignments then assignment}
    <ul class="list-group mt-3" id="notesContainer">
        {#each assignment as a}
            {#if a.Days <=5}
                <li class="list-group-item d-flex list-group-item-danger item-{a.id} justify-content-between">
                    <p class="p-0 m-0 flex-grow-1 id=item-{a.id}">{a.Note} due {a.Date} {a.Days}</p>
                    <button class='btn btn-success mr-1' on:click={editItem(a.id)}>edit</button>
                    <button class='btn btn-danger' on:click={deleteItem(a.id)}>delete</button>
                </li>
            {:else}
                <li class="list-group-item d-flex list-group-item-success item-{a.id} justify-content-between">
                    <p class="p-0 m-0 flex-grow-1 id=item-{a.id}">{a.Note} due {a.Date} {a.Days}</p>
                    <button class='btn btn-success mr-1' on:click={editItem(a.id)}>edit</button>
                    <button class='btn btn-danger' on:click={deleteItem(a.id)}>delete</button>
                </li>
            {/if}
        {/each}
    </ul>
    {/await}
</div>