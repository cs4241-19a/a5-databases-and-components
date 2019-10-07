## Assignment Application

https://glitch.com/edit/#!/a5-retat

I had already implemented a mongoDB in my assignment 3 so I decided to try to implement svelte. For reference that's the link to my assignment 3: https://a3-retat.glitch.me <br>
During the implementation I quickly realized that it's gonna be much more complicated then I initially thought. I used many very complex plain JS functions in assignment 3 to generate code and to interact with the user.
I realized that I had to basically recode everything to use some of the functions that svelte offers.<br>
I wanted the assignments to be shown in a dynamically generated list that by using svelte doesn't get generated by multiple complicated JS functions.<br>
The code I came up with in the App.svelte file looks like that:<br>
```html
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
```
Locally after many hours I got some features to work but I couldn't get every feature from assignment 3, especially the edit and auth functions, to work.<br>
Sadly I couldn't get the svelte application to work on glitch or heroku at all because it always only returned the empty html file without inserting
the App.svelte. <br>
I linked the glitch edit view at the top so anyone can look at the files.<br>

To sum it up I think svelte could have really helped building assignment 3 from the start but I can really not recommand trying to make the switch to 
svelte if the application isn't very simple, does already work and is build with plain JS.