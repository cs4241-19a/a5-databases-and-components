var Item = require("../models/item");
var Comment = require("../models/comment");
var middlewareObj = {};

// Ensure that the user is logged in and owns item
middlewareObj.checkItemOwnership = (req, res, next) => {
	// Ensure user is logged in
	if(req.isAuthenticated()) {
		Item.findById(req.params.id, (err, foundItem) => {
			if(err || !foundItem) {
				req.flash("error", "Item not found");
				res.redirect("/items");
			} else {
				// Ensure user is the owner of the item
				if(foundItem.author.id.equals(req.user._id)){
					// User owns the item
					next();
				} else {
					// User does not own the item
					req.flash("error", "You don't have permission to do that");
					res.redirect("/items/" + req.params.id);
				}
			}
		});
	} else {
		// User is not logged in
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}

// Ensure user is logged in and owns comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
  // Ensure user is logged in
  if(req.isAuthenticated()) {
    // Ensure the item corresponding to the comment exists
		Item.findById(req.params.id, (err, foundItem) => {
			if(err || !foundItem) {
				req.flash("error", "Item not found");
				return res.redirect("/items");
			} else {
				// Ensure the comment exists
				Comment.findById(req.params.comment_id, (err, foundComment) => {
		      if(err || !foundComment) {
						req.flash("error", "Comment not found");
		        res.redirect("/items/" + req.params.id);
		      } else {
		        // Ensure user is the owner of the comment
		        if(foundComment.author.id.equals(req.user._id)){
		          // User owns the comment
		          next();
		        } else {
		          // User does not own the comment
							req.flash("error", "You don't have permission to do that")
		          res.redirect("/items/" + req.params.id);
		        }
		      }
		    });
			}
		});
  } else {
    // User is not logged in
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
  }
}

// Check if user is logged in
middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
		req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;
