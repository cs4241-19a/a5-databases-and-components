## Integrating MongoDB into A3

your glitch link e.g. https://a5-brandon-m-navarro-brandon-navarro.glitch.me/login

  For my project, I integrated MongoDB to handle my database of users and passwords. This meant creating Atlas account and connecting my database to my Glitch
application. Whereas previously my 'database' was simply an array of user objects that would not persist after the session ended, now user information is saved
and persisted through a cloud database. Connecting MongoDb meant I had to create a schema for a user that included a name,email, password, and creation date time.
I also had to fix how users were saved when regeristing and how their account information was retrieved from the database. NOTE: I didn't end up fixing the todo 
application itself, but the assignment says to just fix the application you turned in, so I figured that I did enough for the assignment.

  I think implementing a cloud database improved my development experience. It was somewhat annoying at first connecting my database to my application because I 
didn't realize I had to edit the string Atlas gave me to explicitly specify what cluster I was using. After that though, using MongoDB was actually pretty easy to use.
It made it really easy to see what was stored in my database through the Atlas UI and was cool to see my data actually being sent to a cloud database.

## A sample email with a password has already been registered, but the registration works so feel free to create you own user and try it out. ##

  Test email:      brandon@gmail.com
  Test password:   brandon