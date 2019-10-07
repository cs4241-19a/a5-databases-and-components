require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"Cart":[function(require,module,exports){
window.onload = function () {
  fetch('/loadCart')
    .then((res) => console.log(res.json()))
    .then((data) => {
        $('.tbody').remove()
        let tbody = $('<tbody />').appendTo($('.cartFill'))
        let totP=0
        // if(ch1 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 1</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch1}</td>`)
          totP = `${ch1}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch2 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 2</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch2}</td>`)
          totP = `${ch2}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch3 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 3</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch3}</td>`)
          totP = `${ch3}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch4 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 4</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch4}</td>`)
          totP = `${ch4}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch5 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 5</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch5}</td>`)
          totP = `${ch5}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch6 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 6</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch6}</td>`)
          totP = `${ch6}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch7 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 7</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch7}</td>`)
          totP = `${ch7}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
        // if(ch8 of data != 0){
          $('<tr>').appendTo(tbody)
          .append('<td class="ChzName">Cheese 8</td>')
          .append(`<td class="ChzUnitP">5</td>`)
          .append(`<td class="ChzQuant">${ch8}</td>`)
          totP = `${ch8}`*5
          .append(`<td class="ChzTotP">${totP}</td></tr>`)
        // }
    })
}

module.exports = { }

},{}],"loadScript":[function(require,module,exports){
// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 3!")

function addToCart(chz){
  console.log('attempting addToCart')
  let body=JSON.stringify({ cheese: chz})

  fetch( '/addToCart', {
    method:'POST',
    body,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  })
  .then( res => res.json() )
  .then( console.log )
}

function loadAcct(chz){
  fetch( '/loadAcct', {
    method:'GET',
    credentials: 'include',
  })
  .then( res => res.json() )
  .then( console.log )
}

module.exports = { addToCart, loadAcct }

},{}]},{},[]);
