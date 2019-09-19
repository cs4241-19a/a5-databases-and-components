## Destination Locations

http://a3-AndrewLevy395.glitch.me

My project is a site where users can go to post about their experiences with different vacation destinations. Users can create an account and add their own reviews of destinations. They can also view a list of all of the destinations posted by all users so that they can learn about other people's experiences as well. Users can see who posted which destination and what they reviewed it on a scale from 1 to 5. The list is filtered so that each destination posted by the user currently logged in has two buttons below it. These buttons allow the user to modify or remove from their destinations in the database and not from destinations posted by other users (with the exception of the admin account).

The goal of this project was allow for people (and myself) to be able to learn about other people's experiences on vacations. I enjoy traveling and want to learn more about the amazing places people have been. A challenge I faced during the creation of the application was positioning of containers with different position styles (relative vs absolute vs fixed). Some of my containers (divs) that contained many elements gave me problems with my formatting. I chose to use passport locally and lowdb as authentication/database. I chose both of them because they were recommended in the assignment description so I knew that if I had issues I could ask and get a more clear response. I used bootstrap as a CSS framework but I tried to do a lot of custom CSS on this assignment because I enjoy it and hope to be a web devloper so I wanted to improve my skills.

Feel Free to create an account of your own or use admin (password test) to view the site! Admin will allow you to remove or modify any post you want!

Middleware:
Passport: Login and authentication
Body-Parser: For easier reading of post request bodies
LowDB: For storing persistent data
Cors: Enabled Cors accessibility ( https://a3-AndrewLevy395.glitch.me/cors-entry)
Bcrypt: For easier encryption of passwords

## Technical Achievements

- **Tech Achievement 1**: Server stores multiple json objects of data (destinations and users) on a lowDB database. Each user can only log one review of each destination (checked by requests). All locations data can be removed and modified from database which then updates the front-end.
- **Tech Achievement 2**: I utilized bcrypt to encrypt passwords for each user to be stored in the database to make data more secure
- **Tech Achievement 3** Allowed resources to be shared through CORS accessibility

### Design/Evaluation Achievements

- **Design Achievement 1**: Designed page based on Bootstrap framework to improve appearance
- **Design Achievement 2**: Elements from database are added to front-end as flex boxes with unique IDs on each button to allow for easy access to modify and remove boxes easier
- **Design Achievement 3**: Modal pop-ups allow for more forms (login and modify) without having to migrate pages
- **Design Achievement 4**: Utilize fixed and relative positioning to have overlapping images and containers
