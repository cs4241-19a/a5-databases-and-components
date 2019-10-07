Assignment 5 - Databases and/or Components
===

Book Tracker 3.0

hosting link: https://a5-ktrose1.glitch.me/

--------------------------
Logins:

uname: admin
pword: admin

uname: Katherine
pword: kt

^the above two accounts already have book data in mongo that you can view right away but anyone can make their own account and start adding books

--------------------------
I love to read but I often find myself forgetting the book suggestions that people tell me, or vice versa not being able to provide suggestions on the spot. This project is an organizational tool to keep track of all the books you have read and you want to read, showing not only the name of the books and authors but also a comments section and ratings which furthermore sort the books into sections based on if you did or didn't like them. I've personally already started using the website, transitioning over from keeping my "To Read" list in my Notes on my phone, which was hard to visualize unlike my website. While this is a personal organizational tool at this time, in the future I could envision it as a forum for book lovers to share their best/worst book picks.

Note: Almost all the time, clicking the buttons will automatically update the tables (I have my loadData function for the tables called in all of the onclick functions) but sometimes you may need to refresh the page if a button was pressed but the tables aren't automatically updating.

--------------------------
For my addition to a3 I decided to add in MongoDB
1. Rework the server component from Assignment #3 to use MongoDB or some other NoSQL database (like CouchDB). You can remove Passport authentication if you choose, although this might be as much work as simply changing your Passport calls to use MongoDB.

I really enjoyed learning more about mongo and other database options. Implementing this project was hard at first when I was still going through documentation
and it took a while for me to connect to mongo, but once I did the actual calls to the database were pretty easy and straighforward. There's a lot of good documentation
online about mongo and using it definitely improved my development experience. This was great experience especially because I know a lot of companies actually use 
mongo. A couple of technical points: I kept passport, have my passwords stored in the .env file, and you the book info that displays is still user specific depending on who is logged in.