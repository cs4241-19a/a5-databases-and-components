CS4241 Assignment 5: Better Name Book with MongoDB
===

Author: Rui Huang

## How to use the web app?

### Run locally

Install `npm` and `Node.js`, then run:

`
$ npm install
`

`
$ npm start
`

And go to `localhost:3000/login.html`

### Online application

Or you can also view the online application here:

Link to the web app: http://a5-ryc1x.glitch.me/login.html

(Glitch got some wired errors when connecting to MongoDB, so Glitch may not work)

### Authentications

To use the app, you need to first register an account or login with the following users:

| Username | Password |
| -------- | -------- |
| user     | pass     |
| rui      | rui      |
| iris     | iris     |

## Summary

For this project, I replaced lowDB with MongoDB as back-end DB service. The MongoDB is a powerful tool but in such a small app it's a bit harder to use and there are some functionalities aren't provided. E.g.: remove an element in array by index was not provided in the MongoDB Driver. Also, using mongoDB causes lags and users need to refresh to see the updates.

