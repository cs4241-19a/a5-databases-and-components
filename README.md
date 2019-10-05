## Note Keeper (now with MongoDB!)

http://amarkoski-a5-amarkoski.glitch.me

This program uses Node.js to allow users to create an account and add, modify, and delete a note with a title and a body. The main change since assignment 3 was changing the database storage from lowdb to MongoDB. This was initially somewhat tricky to implement since queries with MongoDB return results in promises rather than immediately being able to be set to variables. This required some remodeling of some methods but overall, the syntax for making database calls was more clear and straightforward than lowdb.
