<script>
    export let name;
    import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'sveltestrap';

    let isOpen = false;
    const toggle = () => (isOpen = !isOpen);

    // Add some Javascript code here, to run on the front end.
    let searchResults = [];
    let query;
    let snackbar = {
        visible: false,
        message: '',
    };

    function submitForm(e) {
        // prevent default form action from being carried out
        e.preventDefault();
        let params = serialize({
            q: query,
        });
        console.log(params);
        fetch(`/search?${params}`, {
            credentials: 'include',
        }).then((res) => res.json()).then((data) => {
            if ('error' in data) {
                alert(data.error.message);
                return;
            }
            searchResults = data.tracks.items;
            console.log(searchResults);
        }).catch((err) => console.log(err));
        return false;
    }

    const serialize = function(obj) {
        let str = [];
        for (let p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        return str.join('&');
    };

    function addToQueue(e) {
        let $this = e.currentTarget;
        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: $this.children[4].innerHTML,
            }),
            credentials: 'include',
        }).catch((err) => {
            snackbar.message = err.message || 'Could not add song to queue';
            snackbar.visible = true;
            setTimeout(() => snackbar.visible = false, 3000);
        }).then(response => response.json()).then((data) => {
            snackbar.message = data.message;
            snackbar.visible = true;
            setTimeout(() => snackbar.visible = false, 3000);

        });
    }

</script>

<style>

</style>

<Navbar color="light" light>
    <NavbarBrand href="/" class="mr-auto">Spotify Jukebox</NavbarBrand>
    <NavbarToggler on:click={toggle} className="mr-2"/>
    <Collapse {isOpen} navbar>
        <Nav navbar>
            <NavItem>
                <NavLink href="login/">Login</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="queue.html">Queue</NavLink>
            </NavItem>
        </Nav>
    </Collapse>
</Navbar>
<div class="container mt-2">
    <div class="center">
        <form id="queryForm" class="form-inline mx-2 my-2 my-lg-0" on:submit|preventDefault={submitForm}>
            <input bind:value={query} class="form-control mr-1 search" autocomplete="false" type='text'
                   placeholder="Search Tracks"
                   id='query' name='query' required=true>
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
    </div>

    <div class='mt-3 results'>
        <table class='results-table table table-dark table-hover'>
            <thead>
            <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Album</th>
                <th>Length</th>
            </tr>
            </thead>
            {#each searchResults as song}
                <tr on:click={addToQueue}>
                    <td>{song.name}</td>
                    <td>{song.artists[0].name}</td>
                    <td>{song.album.name}</td>
                    <td>{moment(song.duration_ms).format("m:ss")}</td>
                    <td hidden="true">{song.id}</td>
                </tr>

            {:else}
            {/each}
        </table>
    </div>
</div>
<div class="{snackbar.visible ? 'show' : ''}" id="snackbar">{snackbar.message}</div>
