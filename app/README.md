## Updated Soccer Star Stats

glitch link: https://a5-gccromwell.glitch.me/

The goal of the application is to provide a place for soccer teams or soccer families to keep track of their own statistics and be able to compare them with their teammates, friends, and favorite star players. Each user can edit their stats once logged in, see the rest of the player's stats, or sign up.

### What Changed for A5
- **I switched out Lowdb for MongoDB. I personally felt like MongoDB was really easy to use once implemented. It was very user-friendly.

Below is leftover from my README for A3.

I faced challenges starting the project. For some reason I had difficulty running code from in-class lectures so starting to include Passport and LowDB was difficult. I played around with using MongoDB but was unable to get it to work. Once I was able to figure out Passport and LowDB, the rest of the application came easier. I ended up using LowDB and the local strategy of Passport because it ended up being easier to implement. I used Bootstrap because it is one of the most popular and provided some great templates for sign-in screens. I had difficulty seeing it work as well with my other pages, so I have individual css pages for my sign-up page, home page, and edit page.

Express Middleware:
-body-parser: Parses HTTP request bodies for json
-cookie-parser: Parses cookie header and populate request cookies
-morgan: formats HTTP request logs
-response-time: records the HTTP response time
-passport: local strategy authentication
-session: establishes server-based sessions

## Technical Achievements
- **Added alerts for incorrect login credentials and for when you delete an account so the user understands what is going on.

### Design/Evaluation Achievements
- **Tested my website with the Wave web accessibility evaluation tool and added form labels and a fieldset/legend to significantly reduce the number of errors and make my website more accessible.

![alt text](https://cdn.glitch.com/7dab8346-8dfa-4d88-ba66-2bad66b668b0%2Ftest%20screen%20reading%20a3.PNG?v=1568899938330)

- **Added my own CSS sheets for some of my pages
