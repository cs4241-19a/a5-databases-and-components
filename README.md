Assignment 5 - Databases and/or Components
===
---

## Create a Harry Potter Character (Version 3)
Janette Fong
[https://a5-jlfong.glitch.me/](https://a5-jlfong.glitch.me/)

The user can create their own Harry Potter character by filling out the form.  Once they submitted their information, a table with current added characters is displayed.
Depending on what they answered for the survey question, their character will be sorted into one of the Hogwarts Houses (Gryffindor, Hufflepuff, Ravenclaw, Slytherin).

## Requirements Met
- Changed from lowdb (Assignment 3) to MongoDB (Assignment 5)

Users can create their own Harry Potter characters with this application.
I modified the server to use MongoDB instead of lowdb.  I also needed to change my fetch statements and how I displayed the table.
I see the appeal of using MongoDB.  For this assignment, however, since I changed lowdb syntax to suit MongoDB syntax, I also edited
my script code involving the table.  Lowdb is more related to jsons and can take an index easier.  For MongoDB, it makes more sense
to query specific fields.