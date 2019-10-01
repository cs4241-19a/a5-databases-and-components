## Grocery List Online

http://a3-kdoje.glitch.me (**SEE BOTTOM FOR USER GUIDE AND IMPORTANT NOTE**)

- **The goal of the application**: This application serves as a way to synchronize grocery lists across devices. By registering a list name and password you can add, edit and delete items. You can then log into a separate device and see edits to the list you created. 

- **Challenges**: 
    - The first challenge was to determine how to associate items with their respective lists.
    - The second challenge was to ensure that two users with the same usernames (or listnames) can't be created. 
    - The third challenge was updating the dbAccessor to get items based on users.
    - The next challenge was aligning and optomizing screen usage for the item list
    - The final challenge was allowing users to edit the items in place.
- **CSS Framework**:
    - I used the materialize framework because it provides a smooth experience on mobile and desktop.
- **CSS modifications**:
    - I created three customizations to change the color of the input underline, and the hover effect on the icons on the card.
- **Authentication strategy and database**:
    - I chose to use the local strategy with a SQLite database. Because users will create multiple lists, the local strategy allows a single person to manage multiple lists. I used SQLite for its ability to easily store large data sets.
- **Express middlewares**:
    1. passport: the authentication middleware
    2. bodyParser: automatically parses the request body to json for application/json request type
    3. static: provides static content automatically (from the public folder in my case)
    4. favicon: provides the icon for the webpage automatically
    5. morgan: automatically logs request information so I can see what browsers my users prefer the most.

## Technical Achievements
- **SQLite database for users and list items**: I expanded the existing dbAccessor to work with two tables and pull the data into ram when used to decrease access time.
- **Asynchronous unit tests for dbAcessor**: I expanded the unit tests to include users and ensure that items would be returned based on username properly. These test the interaction of the user list and item list
- **Modular Authorization**: I perform the authorization in a separate file from the server so I can expand the functionality without affecting other middlewares.
- **Access and response optimization**: On start up all pull all elements from the database into list objects to speed up access. I also perform client side checks to ensure no bad requests are sent, to further reduce database read/write time.

### Design/Evaluation Achievements
- **Mobile access**: I tested my application on a mobile platform and was able to use all features of the application
- **Item cards**: I used the materialize card to create my list items on the UI. I also included dynamically generated form items within the card to allow the user to edit their list.
- **Slide out login**: I used a slide out sidenav to allow users to login and preview the list.
- **Unobtrusive error messages**: I used materialize toasts to tell the user when an operation didn't complete successfully.
---
### User guide
-*IMPORTANT* Make sure the database is intialized before connecting to the server.` The log will print initial dao list length is` When it's intialized and ready for you to connect to.
- First create an account 
    - click the person icon on the bottom right
    - Then enter a name and password and click create
- Create an item by filling in the item and quantity field, then pressing submit.
- To modify an item:
    - click the trashcan to delete the item
    - click the checkbox to mark it as purchased
    - change the name on the first text field and press enter to submit the change
    - press the plus or minus button to increase/decrease the quantity, or enter a number manually.
