## Odd Blog V1.5


Dan Duff


https://a5-dandaman2.glitch.me/

## Odd Blog V1.5 is an edited version of my Assignment 3: Odd Blog using a MongoDB Databse

_Assignment 3 Description_
My application for Assignment 3 is titled "Odd Blog" for a wingding message board. 
I've always been curious about the symbolic language of wingdings, and was wondering 
if the font type could be used for any kind of communication/messaging. Odd Blog is 
that curiosity come to life, as it's the world's first wingding messae board. 
Although the app is meant to be used as a wingdings communication platoforms, 
any user can use the toggle switch at the top of the site to covert all text 
(even inputted text) to and from wingdings/english. All posts are stored in a database, 
which is persistent among sessions. Odd Blog uses a Google OAuth login system for post posting 
and reviewing posted messages. (Users can both create new posts, as well as delete their own old posts.) 


(Sample Credentials for Testers): username: a32019Tester@gmail.com | password: giveaplease 


In creating this site, I used the bootstrap CSS framework and w3 CSS stylesheets, in addition to 
adding my own styling in classes to change both the positioning and displayed language/font of elements.


_What I Changed for Assignment 5_
Previously in Assignment 3, Odd Blog used a SQLite3 relational database. For this project, I decided to switch to 
a MongoDB structure. These changes all occured on the backend, and can be seen in the server.js file. 
Overall, I believe that if the project was more widely-used, and scaleability was an issue, implementing the MongoDB 
structure would be more beneficial (especially with web hosting). On a smaller-scale however, there were no changes to the
client's front-end experience, so the immediate noteable differences were negligible. The readability of the routing methods 
is slightly better however, as there is much less syntax in interacting with the database.