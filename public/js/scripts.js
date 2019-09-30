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
