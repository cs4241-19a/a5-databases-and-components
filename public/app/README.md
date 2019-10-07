## Secure Note

my glitch link e.g. http://a5-kaitlinmcdermott.glitch.me

My application is used to hold imporant notes for a user.
The goal is to have a user log in and have all of their notes that they wanted secured by 
authentication located on the site. 
I used passport for my authentication because I thought the implementation was easiest. 
I also chose to use lowdb because it seemed the easiest to implement. 
I referenced this CSS stylesheet: https://gist.github.com/dan-auth0/b40f8a12de8843243ef50abcff051da1
for styling the buttons and fonts.

Five Express middleware packages:
1. Passport is used to authenticate users when logging into the site. 
2. Session used to define options that are enabled during a session
3. Morgan used to log HTTP incoming requests
4. Helmet used to set HTTP requests
5. Body-parser used to parse incoming request bodies before handlers. 
6. Node-statsd to collect response times
7. Response-time to collect to respons times

Challenges:
The main challenge I faced is that when I implement a new functionality to my project,
it would break other functionalities in my project. I also had some issues with
getting my database to work correctly and to show all of the form entries. 

## Technical Achievements
- **Tech Achievement 1**: Used a tags and nav tabs to create links to other pages
- **Tech Achievement 2**: Used 7 express middleware packages along with other packages.

### Design/Evaluation Achievements
- **Design Achievement 1**: I continued to try new things with css files including 
using a gradient background.
- **Design Achievement 2**: I created styled buttons.
