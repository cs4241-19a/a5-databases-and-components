// app.post( '/submit', bodyparser.json(), function( request, response ) {
//   dreams.push( request.body.newdream )
//   response.writeHead( 200, { 'Content-Type': 'application/json'})
//   response.end( JSON.stringify( dreams ) )
// })

new TypeIt('#typeEffect', {
  speed:50,
  startDelay: 1500
})
    .type( "I AM MINEEM,")
    .pause(500)
    .options({speed: 30, deleteSpeed: 75})
    .delete(12)
    .type("YOUR PERSONAL SHOPPING ASSISTANT")
    .go();

// new TypeIt('.section-sub-title', {
//   speed:40,
//   startDelay: 5000
// })
//     .type( "I am here to help you keep track of your wish list, ")
//     .pause(500)
//     .type("monitor the price of your wish-list items, ")
//     .pause(500)
//     .type("and notify you when their prices drop.")
//     .go();

