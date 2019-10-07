Assignment 5
=================

I attempted to use mongoDB, but was not successful. The code tried was commeted out in the server.js file
Below is the readme for A3 on how to use this project.

https://a5-andrewhand.glitch.me/

This is a simple application designed for a user to log in and edit there own deck list for the card game Magic the Gathering.
The site requires you to log in before use.

One of the biggest challenges for me when completing this assignment was understanding the documentation for the variety of express middlewares.
I felt as if I constantly choose to read different sources/examples other than the docuemntation provided to full grasp the scope of the middleware
because many of them are simply constructers that work behind the scenes. Stepping though those interactions played out with the help of a debugger
was also of great help.

For the authentication middleware, I choose to use passport.js seeing as it was covered in class and I did not feel I had the time to learn another
service on my own.

The middlewares I choose:
- *express-session* - Used in class this was a easy solution to session based web servicing.
- *cookie-parser* - Required for passport as authentication is sent via cookies.
- *body-parser* - Simplfied request parsing for incoming JSON strings 
- *helmet* - 2 lines, extra security, enough said. Protect your site and protect your users.
- *passport* - Authentication service covered in class, again a simple solution to a complex problem
- *SQLite* - I need a database that would support read/writes from multiple users at the same time. This was the easiest solution.
- *lowdb* - I needed something to store (Username, Password) combinations and I wanted to try it out and see if it was easier than SQLite.

For this assignment, I choose to use Bootstrap as my CSS framework because I have used it for other websites and feel confident in its application. 
I also appreciate Bootstraps simple designs, where as other frameworks are too focused on adding in addtion elements that are not needed for the page
to be function AND elegant.

To Use:
------------
- Click `Add` to add the information from the `Quantity` `Card Name` and `Set Name` Fields.
- Click `Update` to change the information in the `Quantity` field for a given `Card Name` and `Set Name`. <br />
  **NOTE:** The `Card Name` and `Set Name` fields may not change for this.
- Click `Update` then `Delete` to delete the a entry entirely.
- Click `Login` in the nav bar to log into your account.

Currently the only user is: <br />
**Username:** *Andrew* <br />
**Password:** *Password*

To create a new user: <br />
- Click the `Sign Up` button. <br />
- Enter a new `(username, password)`. <br />
- Then click `Sign In` and you should be directed to the Login page.

To log out of your account:
- Click `Sign Out`


Design Achievements
------------

- Use of Bootstrap in place of traditonal CSS styling to simplify the design of the website.


Technical Achievements
-------------------
- Use of a enviromental variables to create a secure session secret.
- Implementation of SQLite to store persistent data to be displayed in the deck list table. 
- Use of automatic redirects for the sign in/out pages that vary for success and failure cases.
- Users decklist will only appear for that user, and no other user.
