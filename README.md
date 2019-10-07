## TaskTracker

your hosting link e.g. http://a5-manasmehta18.glitch.me

I added React to the two pages I designed for a3. I created two classes extending react.component and these classes delivered the entire page as a react component. I rendered the 
components using jsx. Because of the extremely convoluted and complex structure of the html and the css files, I stayed away from adding minute react components for each and
every DOM element. Use of react does make it a lot easier to generate web pages because everything can be put inside a javascript file, allowing you to edit a react component's html,
js and css aspect. I had a lot of issues with hosting the actual react element. I used npm and the instructions on parcel. So I created the dist and src folders, added a .babelrc file,
Added the required dependencies in package.json and the required npm scripts. When I run npm run build-prod, it builds just fine adds the file to the dist folder. When i run npm start,
it runs fine again and runs the server on localhost:1234, however it just doesnt display the react component. I tried hosting on glitch and it didnt work and all the documentation I 
looked for online wasnt really helpful. 