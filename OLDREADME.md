# Assignment 3 - Persistence: Two-tier Web Application with Flat File Database, Express server, and CSS template

Due: September 16th, by 11:59 AM.

## TO DON'T

Default account:

 - Username: admin
 - Password: admin

http://a3-mhwestwater.glitch.me

### Goal

The goal of this application was to create a list of bad habits or tasks which the user should avoid.

### Challenges

- Authentication was initially difficult to understand and debug with the cookies, but once the dev tools and /test were used it began to make sense.
- Validation requiring a handshake with the server required more complex interconnections.

### Authentication Strategy and DB

- Utilize server stored username/password to not rely on any external frameworks. Also an excuse to use lowdb to store credentials.
- DynamoDB was used for the application data as that was a tech achievement in A2. Lowdb was then used to store usernames/passwords to fulfil the requirement of a local db.

### Express Middleware

- passport: Authentication users using cookies
- body-parser: Parses HTTP parameters from user
- serve-favicon: Serves the favicon for the browser tab
- serve-static: Exposes files in given directory to user
- compression: Makes sending of data slightly more efficient

### CSS Framework

- Bootstrap 4 was used as a CSS framework as I have used it in the past and its a common framework
- Allows for resizable responsive webpages

## Technical Achievements

- **Extend AWS DynamoDB Table**: Extended the database stored in AWS to keep data for individual users
  - Data is returned for only the specified user through AWS-SDK queries
- **Form Validation**: Checks user inputs to make sure they are valid
    - Things that are checked for and alerted to user
      - Correct password
      - Missing fields in forms
      - Duplicate username in account creation
- **Security of Pages**: Only let users view pages if they're logged in
    - Avoided putting html in the public folder so that users who weren't logged in couldn't access them
    - Redirect is set up so that if user isn't logged in they're redirected to the login page

### Design/Evaluation Achievements

- **Multipage Layout**: Different pages for displaying, editing, and creating data
    - In addition to pages for login and about
    - Simplifies UI as each page is very clean
- **Utilize Alerts for user feedback**: Utilized Bootstrap alerts for validation in login and submission
    - Display error messages to users on the login/account creation screen
      - Missing fields
      - Duplicate username on new account
      - Incorrect password
    - Display error on submission of list item
      - Error on missing data
- **Navigation Bar**: Navigation for going between pages in persistent header
  - Allows for user to quickly change pages depending on desired task
  