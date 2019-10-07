<h1>Nyankotracker, MondoDB Edition</h1>
<em>https://a5-javiermarcos.glitch.me/</em>
<p>
The application has been redesigned in order to use MongoDB for its database, rather than lowdb. All of the functions previously present have been successfully translated, including authentication and data manipulation. The only exception to this is the function meant to show all of the information stored in the database; doing so became quite more cumbersome than just sending a JSON file stored in the server and is not something you would usually consider to develop.
</p>
<p>
Since this was my first time using MongoDB, figuring out how to get the functions up and running was rather diffcult and resulted in quite a messy code. However, doing so allowed for the all of the data to be stored outside of the server itself, which may provide certain advantages.
</p>