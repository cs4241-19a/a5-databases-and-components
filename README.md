ChatSvelte
===

https://a5-thearst3rd.glitch.me

Using the svelte-template, I recreated a slimmed down version of my assignment 3 (PermChat). Unfortunately, the svelte-template does not really include server code, and I was too intimidated by the rollup.config script and different package.json startup scripts that I decided to just leave those alone and make a client-side application and let the template serve out the files as needed. I also did this so that I could have it detect differences in the .svelte files and automatically generate the output properly when I was working on it.

The new technology DEFINITELY improved the development experience. I followed along with the Svelte tutorial (https://svelte.dev/tutorial) which was incredibly helpful and informative. Using information that I gathered from that tutorial, I was able to incredibly rapidly reimplement the client-side functionality from assignment 3 in an incredibly short amount of time. It is incredibly refreshing to not need to maually keep track of DOM elements and use `getElememtById("blahblah").contents` or anything along those lines.

That being said, I had a hard time figuring out how to integrate it with an existing application. They advertise on the website that this is easy to do, but all I could figure out was that there was magic behind the template application and not how to use the svelte compiler in the command line. I feel like it is probably easy, just an invoation of a `svelte` command, but I also feel like it could get much more complicated. Whatever, I feel like that is a small step to get over and that in a real situation it would be tackled right at the start. Overall it definitely was an improvement over classical techniques.