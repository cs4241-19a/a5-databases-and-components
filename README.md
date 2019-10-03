## shopr - your online wishlist
shopr is a web app pertaining to e-commerce that allows users to collect and manage an online shopping list. This solution serves as an organizatal tool to alleviate the clutter of maintaining web links and product information in basic note taking or text editor software. shopr is a platform dedicated to simplifying the online shopping experience through providing a minimalistic interface that supports basic actions and a central storage location so that information never gets lost.

Users can add shopping items to their wishlist with an associated external link to help track specific locations on the web. By clicking on wishlist items users can navigate to the associated Internet destination. The app also encourages users to select a rating for each item based on desire (where 5 stars represents the most desirable items). The wishlist is then sorted based on ratings and the top 3 most desired items are displayed in a Favorites section. The remainder of the wishlist is stored in a table below the Favorites panel. Here users can update and delete existing records.

https://a5-benemrick.glitch.me

This project was refactored for assignment 5 to use MongoDB, a NoSQL persistent data store instead of lowdb.

This site is built with an `express.js` server that uses `passport.js` middleware for user authetication. All data consumed by shopr is maintained using `lowdb`, which is a local JSON database that persists between server sessions. The front-end styling of shopr is built using the Bootstrap CDN and its CSS components.

