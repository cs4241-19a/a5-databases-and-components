Assignment 5 - Databases and/or Components
===

Due: October 7th, by 11:59 AM.

For this assignment you will complete one of the following tasks, based on your prior experience with the various technologies involved.

1. Rework the server component from Assignment #3 to use MongoDB or some other NoSQL database (like CouchDB). You can remove Passport authentication if you choose, although this might be as much work as simply changing your Passport calls to use MongoDB.
2. Rework the client component from Assignment #3 to use Svelte in some capacity.
3. Rework the client component from Assignmeent #3 to use React in some capacity.

For 2 and 3, make sure to look at [the notes from lecture 10](https://github.com/cs4241-19a/materials/blob/master/lecture10.markdown).

This is really a chance for you to experiment with some additional web technologies that the prior assignments haven't covered yet: non-flatfile databases and web component frameworks.

This project can be implemented on any hosting service (Glitch, DigitalOcean, Heroku etc.), however, you must include all files in your GitHub repo so that the course staff can view them; these files are not available for viewing in many hosting systems.

---

## Hotel Casa Anagha

https://a5-anaghalate.glitch.me/

Hello! This website is one that would be used to book a room at a hotel. You can create a new booking, view past reservations, and also have the ability to modify and delete them. 

The credentials are as following, no new users can be added to this site :

username: username

password: password

(really secure right?)

Previously, I had a lowDB server however for this assignment, I chose to replace it with a MongoDB server. I really struggled with setting up and authenticating MongoDB but had little to no trouble incorporating it my actual code. I believe this was due to the minimal Mongo documentation provided. The one part I really struggled with was the actual creation of the credentials in the Collections tab of their website.

However besides my struggles, the main thing I really like about MongoDB is how it only allows certain admins to read, write, or both - thus, keeping information incredibly safe. 
