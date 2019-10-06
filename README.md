## Online Shopping Calculator

https://a5-randyagudelo.glitch.me/

- This project helps the user create a shopping list where they can add, modify, and remove products as well as give the final total cost of all the products in the list.
Each user can have their own shopping list by creating their own account which allows each user to have a unique and distinct shopping list which is saved to the server

- If Create An Account does not work, you can use these existing credentials to login and test: {username: ragudelo , password: 1234} and {username: uname , password: pass}

- These existing credentials should already have some products in their own respective lists.

- The changes I added to assignment 3 was implementing MongoDB instead of lowDB and removing passport. MongoDB was used to store the users' accounts, passwords, and shopping list. 
This change improved the development experience because it made me have much less code than I previously had with lowDB. Once I understood how to work with MongoDB, it was much 
easier to implement and use compared to lowDB. The users would probably prefer mongoDB also as it is probably more secure and has more space than lowDB.

- Additional Notes/Comments: This web application should allow the user to create a new account and once the user has an account, they should be able to log back in using the login. 
 Once new users have an account, they will start with an empty shopping List which they can add/modify/remove items. Each user has their own respective accounts and shopping list that are 
 all unique to each user. When removing products, users are expected to only remove the products they have in their shopping list using the exact same name that is in their list. 
 **Important: When clicking the sign out, view shopping list, and the back buttons, click on letters within the button to get a response.** 

