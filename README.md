## Pallet Organizer

your glitch link e.g. https://a3-noblekalish.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application is to create a way to organize makeup pallets for each user.
- challenges you faced in realizing the application was dealing with arrays as they would not update the way I needed. I also had issues with making the data base correctly \
work with the data structure I used.
- what authentication strategy / database you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable) I choose to use pouchdb because I had experience with it from the \
previous project. I also used a local strategy that was shown in class for authentication as it was easy.
- what CSS framework you used and why.
  - I choose to use Tailwind for my framework. I used it because it had a cool look and I never used it before.
- the five Express middleware packages you used and a short (one sentence) summary of what each one does.
1. I used passport as a middleware to authenticate users.
2. I used body-parser as a way to parse json from the html to the server.
3. I used express-session to create session cookies for the users
4. I used connect-flash to use the req.flash functions when people incorrectly log in
5. I used express-favicon to put favicons on the website.

## Technical Achievements
- **Tech Achievement 1**: I used a plugin for pouchdb to allow the function upsert that allowed me to check if a doc existed and update it otherwise crete a new one.
- **Tech Achievement 2**: I used pouchdb as the database and created a document for every individual user and uses sessions to check for that users document to keep everyone information separate

### Design/Evaluation Achievements
