
## Movie Tracker!

https://a5-alejandra-garza.glitch.me/

 
Unfortunately I originally had an extremely hard time with a3 (if it wasn't for the extension I have no idea what I would have done) and editing this project was a nightmare. I tried everything for this assignment: MongoDB, Mongoose, React, and Svelte, but unfortunately I was unable to get any of them to work right. This submission is the MongoDB version, but if you want to get a glimpse at my other attempts they are all random projects in my Glitch profile.

 Overall this technology did not improve the development experience at all, in fact it made it much more stressfull. I think the primary issue was that a3 was really complex (for my standards since I have no web development experience) and it was really hard for me to change it. I feel that if I had started the project from scratch (specially with React since it was really interesting but I had a hard time chaning my original project) it would be a much more enjoyable experience.

**Below is a brief summary of the main issue I faced**

While my website loads, it does not show the data: 

![alt text](https://github.com/AlejandraGarza42/a5-databases-and-components/blob/master/screenshots/no%20movies.PNG)

Which is meant to be this: 

![alt text](https://github.com/AlejandraGarza42/a5-databases-and-components/blob/master/screenshots/database.PNG)

I kept getting the following error. 

![alt text](https://github.com/AlejandraGarza42/a5-databases-and-components/blob/master/screenshots/inspector%20error.PNG)

And it looks like the issue was that my home.html file was having issues reaching my home.js file, but no matter how many times I changes the link and/or the position of home.js, nothing fixed it.

![alt text](https://github.com/AlejandraGarza42/a5-databases-and-components/blob/master/screenshots/inspector%20error.PNG)

I even tried getting rid of home.js and just adding it as a <script> in home.html, but my displayTable function was giving me issues with that. 
  I spent a really long time on this and was unable to make it to office hours throughout the week, but it was definitely an interesting experience.
