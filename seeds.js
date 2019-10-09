var mongoose = require("mongoose");
var Item = require("./models/item");
var Comment = require("./models/comment");

var data = [
	{
		
	}
]

function seedDB() {
	// Remove all items
	Item.remove({}, function(err) {
		if (err) {
			console.log(err);
		}
		console.log("Removed items.");
		Comment.remove({}, function(err) {
			if (err) {
				console.log(err);
			}
			console.log("Removed comments.");

			// Add a few items
// 			data.forEach(function(seed) {
// 				Item.create(seed, function(err, item) {
// 					if (err) {
// 						console.log(err)
// 					} else {
// 						console.log("Added an item.");

// 						// // Create a comment
// 						// Comment.create({
// 						// 	text: "This place is great, but I wish there was internet",
// 						// 	author: "Homer"
// 						// }, function(err, comment) {
// 						// 	if (err) {
// 						// 		console.log(err);
// 						// 	} else {
// 						// 		item.comments.push(comment);
// 						// 		item.save();
// 						// 		console.log("Created new comment.");
// 						// 	}
// 						// });
// 					}
// 				});
// 			});
		});
	});
}

module.exports = seedDB;
