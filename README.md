# ChronusContinuum: Part Dos (the continuum-ing)

http://a5-tmwbook.glitch.com

In this project, I modified my a3 project to use MongoDB instead of lowdb.
This actually took a bit of time as I was running lowdb in synchronus mode, and had to adjust a number of the functions to handle the Promise based MongoDB.
Adding this technology complicated the code a bit, but that is to be expected when shoving a new piece of tech in a defined stack.
Had the code been originally designed with asynchorus in mind, I would have architeched it differently.
There were certain guarentees that my functions were expecting, and I had to use some hacky tricks with Promises to fulfill them.