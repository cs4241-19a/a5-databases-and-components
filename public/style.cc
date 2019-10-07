/* styles */
/* called by your view template */

* {
  box-sizing: border-box;
}

body {
  font-family: "Benton Sans", "Helvetica Neue", helvetica, arial, sans-serif;
  margin: 2em;
  background: white;
}

h1 {
  font-style: italic;
  color: Red;
  text-align: center;
}

.bold {
  font-weight: bold;
}

p {
  max-width: 600px;
}

form {
  margin-bottom: 25px;
  padding: 15px;
  background-color: red;
  display: inline-block;
  width: 100%;
  max-width: 340px;
  border-radius: 3px;
}

input {
  display: block;
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  border: 1px solid lightgrey;
  border-radius: 3px;
  font-size: 16px;
}

button {
  font-size: 16px;
  border-radius: 3px;
  background-color: lightgrey;
  border: 1px solid grey;
  box-shadow: 2px 2px teal;
  cursor: pointer;
}

button:hover {
  background-color: orange;
}

button:active {
  box-shadow: none;
}

li {
  margin-bottom: 5px;
}

footer {
  margin-top: 50px;
  padding-top: 25px;
  border-top: 1px solid lightgrey;
}

#main {
  height: 100%;
  width: 100%;
  display: flex;
}

#left {
  width: 50%;
  align-content: center;
}

#right {
  width: 50%
}
