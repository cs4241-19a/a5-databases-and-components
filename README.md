## TaskTracker

your hosting link e.g. http://a5-manasmehta18.glitch.me

I added React to the two pages I designed for a3. I created two classes extending react.component and these classes delivered the entire page as a react component. I rendered the 
components using jsx. Because of the extremely convoluted and complex structure of the html and the css files, I stayed away from adding minute react components for each and
every DOM element. Use of react does make it a lot easier to generate web pages because everything can be put inside a javascript file, allowing you to edit a react component's html,
js and css aspect. I had a lot of issues with hosting the actual react element. I used npm and the instructions on parcel. So I created the dist and src folders, added a .babelrc file,
Added the required dependencies in package.json and the required npm scripts. When I run npm run build-prod, it builds just fine adds the file to the dist folder. When i run npm start,
it runs fine again and runs the server on localhost:1234, however it just doesnt display the react component. I tried hosting on glitch and it didnt work and all the documentation I 
looked for online wasnt really helpful.

Thinking that the issue might be with the size of the component (since Im loading the entire html), I tried fixing the issue by making a smaller react component with only one div, and put
the rest of the DOM elements back in the html file. However, the component didn't render in the div and additionally all of my other js files included in the html stopped working when
I included the js with the react component. I have tried changing stuff on the client and the server side and nothing happens.

I get no error during npm build and run, so I am using react the right way and building the components correctly, the only issue is rendering the components using node.js. I would sit
at this and try to debug for longer but there is no good documentation I could find online and I want to spend more time towards the final project. 

