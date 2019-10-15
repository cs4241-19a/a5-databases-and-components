## Triage v2.0

Try it out at https://a5-jcharante.glitch.me


Web App Source Code: https://github.com/JCharante/triage-spa-v2

API Server Source Code: https://github.com/JCharante/triage-server-v2

Triage helps you keep track of tasks you have to do. It has support for recommended deadlines, and hard deadlines, as for many classes they have recommend doing certain problems after lecture but may only collect homework once a week. There's support for multiple levels of importance and for difficulty. It uses all of the just mentioned filed to calculate a priority score, which is displayed on the web app and is used to sort the list of tasks. This differentiates itself from other existing options.

---

For this assignment you will complete one of the following tasks, based on your prior experience with the various technologies involved.

1. Rework the server component from Assignment #3 to use MongoDB or some other NoSQL database (like CouchDB). You can remove Passport authentication if you choose, although this might be as much work as simply changing your Passport calls to use MongoDB.

2. Rework the client component from Assignment #3 to use Svelte in some capacity.

3. Rework the client component from Assignmeent #3 to use React in some capacity.

---

I went for #1. I already used MongoDB for assignment 3, so I made the necessary modifications to **use another NoSQL Database**. I chose to use DocumentDB. Forunately, **DocumentDB is API compatible with MongoDB, so it did not require any changes** other than changing an environmental variable with the new URI. Unfortunately, DocumentDB is also very expensive, so please grade this quickly. Since it is API compatible with MongoDB, this new technology literally made no difference, actually, the set up was a pain because it's annoying to disable TLS because I don't want to deal with setting up a certificate. I did not edit the print statements in the console, because I don't want to change them back once the assignment is over, I suppose that future work could involve clarifying that we `connected to a MongoDB compatible cluster`.

If you think that DocumentDB is the same as MongoDB, then here is an except from the first google result for `is mongodb the same thing as documentdb`:

```
While AWS advertises DocumentDB as having “MongoDB compatibility”, from what we can tell, AWS is mimicking some of the MongoDB APIs (specifically from MongoDB version 3.6) while using the Aurora PostgreSQL engine under the hood. Many features released in MongoDB version 4.0 are not available in DocumentDB...
```

Fortunately we don't use anything introduced in MongoDB 4.0 or later.
