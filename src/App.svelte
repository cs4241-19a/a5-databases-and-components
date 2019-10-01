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
            <button id="add" class="btn btn-primary col-6">Submit</button>
        </div>
    </form>
</div>
<div class="container">
    <ul class="list-group mt-3" id="notesContainer"></ul>
</div>
<script src="js/script.js"></script>
