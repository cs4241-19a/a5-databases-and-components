// client-side js
// run by the browser each time your view template is loaded

// our default array of plays
let plays = [];

// define variables that reference elements on our page
const playsList = document.getElementById('plays');
const playsForm = document.forms[0];
const odkInput = document.getElementById('odk');
const downInput = document.getElementById('down');
const distInput = document.getElementById('dist');
const playTypeInput = document.getElementById('playType');
const resultInput = document.getElementById('result');
let yardsToFirst;

let playInput = '';

//Trying to initialize plays with existing data from lowdb

//   const request = new XMLHttpRequest();
//   request.open("GET", '/getPlays');
//   request.send();
  
//   request.onreadystatechange = (e) => {
//     if(request.readyState === 4 && request.status === 200) {
//         plays = JSON.parse(request.responseText.plays)
//     } else if(request.readystate === 4 && request.status === 404) {
//       alert("404 Error");
//     }
//   }



const appendNewPlay = function(play) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = play;
  playsList.appendChild(newListItem);
}

playsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();
  
  yardsToFirst = distInput.value - resultInput.value;

  playInput = "ODK:" + odkInput.value
    + ",Down:" + downInput.value
    + ",Distance:" + distInput.value
    + ",Play Type:" + playTypeInput.value
    + ",Result:" + resultInput.value
    + ",Yards To First:" + yardsToFirst;
  
  
  const json = {
    odk: odkInput.value,
    down: downInput.value,
    distance: distInput.value,
    playType: playTypeInput.value,
    result: resultInput.value,
    yardsToFirst: yardsToFirst
  }
  const body = JSON.stringify(json);
  
  fetch( '/submit', {
      method:'POST',
      body
    })
    .then( function( response ) {
      plays.push(response)
    })
  
//   const request = new XMLHttpRequest();
//   request.open("GET", '/getPlays');
//   request.send();
  
//   request.onreadystatechange = (e) => {
//     if(request.readyState === 4 && request.status === 200) {
//       for(let i=0; i<JSON.parse(request.responseText).plays.length; i++) {
//         plays += JSON.parse(request.responseText.plays[i]);
//       }
//     } else if(request.readystate === 4 && request.status === 404) {
//       alert("404 Error");
//     }
//   }
  plays.push(playInput);
  
  appendNewPlay(playInput);

  // reset form 
  playInput.value = '';
  
};
