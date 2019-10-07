## Grade Tabler, but with mongodb

https://a5-pjjankowski.glitch.me/

For a functional description of what my grade tabler application does, see the readme for the a3 submission.

New Changes: I have replaced my sqlite3 database with mongodb, and removed passport, instead using a local authentication scheme
with a cookie manually created once the user logs in. I then check the cookie in the header of requests when the user is logged in 
to get the user's username, matching them with the student grades that they have entered. I also split some of my POST requests on the
client and server, (see Ease of Use). Another change that I made was that I used bodyparser.urlencoded in order
to receive requests with a body, where in a3 this was not necessary.

Ease of Use: Using mongodb had some upsides and some downsides over sqlite3, in my opinion, and overall was more helpful than a hinderance
once I started using it. I found it very easy to retrofit my server post handlers to use mongodb once I was able to get one to work,
but I could not easily find a way to combine methods for modifying and creating new students, or signing up a new user.
This required some client code refactoring to make multiple POST requests instead of one when signing up new users and when
the user clicks the submit/modify button for entering a new student's grades, or modifying a student whose grades were already
in the db.

Default Users:
- Username: User1
 Password: Password1
 Students: John Doe, grade of 75
- Username: charlie
 Password: charliee
 Students: John Doe, grade of 81, and Mary Sue, grade of 99.9
 
http://a5-pjjankowski.glitch.me

An example table might be as follows:

![Image of Example Table](https://cdn.glitch.com/5cd46ecf-8f21-44d2-941d-1799ff06883e%2FGradeTable.PNG?v=1568587030243)