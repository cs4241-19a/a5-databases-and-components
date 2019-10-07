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

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements.
3. Test your project to make sure that when someone goes to your main page on Glitch/Heroku/etc., it displays correctly.
4. Ensure that your project has the proper naming scheme `a5-yourname` so we can find it.
5. Fork this repository and modify the README to the specifications below. Be sure to add *all* project files.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a5-gitname-firstname-lastname`.

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

ChatSvelte
===

https://a5-thearst3rd.glitch.me

Using the svelte-template, I recreated a slimmed down version of my assignment 3 (PermChat). Unfortunately, the svelte-template does not really include server code, and I was too intimidated by the rollup.config script and different package.json startup scripts that I decided to just leave those alone and make a client-side application and let the template serve out the files as needed. I also did this so that I could have it detect differences in the .svelte files and automatically generate the output properly when I was working on it.

The new technology DEFINITELY improved the development experience. I followed along with the Svelte tutorial (https://svelte.dev/tutorial) which was incredibly helpful and informative. Using information that I gathered from that tutorial, I was able to incredibly rapidly reimplement the client-side functionality from assignment 3 in an incredibly short amount of time. It is incredibly refreshing to not need to maually keep track of DOM elements and use `getElememtById("blahblah").contents` or anything along those lines.

That being said, I had a hard time figuring out how to integrate it with an existing application. They advertise on the website that this is easy to do, but all I could figure out was that there was magic behind the template application and not how to use the svelte compiler in the command line. I feel like it is probably easy, just an invoation of a `svelte` command, but I also feel like it could get much more complicated. Whatever, 