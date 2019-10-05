## HTTP Code Scavenger Hunt - MongoDB Edition

https://a5-samgoldman.glitch.me/

I changed my assignment 3 project to use MongoDB (had previously been using LowDB). The biggest change is that the calls are asynchronous, which was not the case with my LowDB implementation. This meant a little extra work when replacing the LowDB calls, but it wasn't very difficult. One benefit is that the MongoDB package has several utitilities that make processing the data easier (no more searching arrays for a specific element). Nothing noticably changed from the user persepective.
