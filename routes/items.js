var express = require("express");
var router = express.Router();
var Item = require("../models/item");
var middleware = require("../middleware");

// Index - Show all items
router.get("/", (req, res) => {
	// Get all items from DB and display them on items page
	Item.find({}, (err,  allItems) => {
		if(err){
			console.log(err);
		} else {
			res.render("items/index", {items: allItems});
		}
	});
});

// New - Show form to create new item
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("items/new");
});

// Create - Add new item to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
  	// get data from form and add to items array
	var name = req.body.name;
	var image = req.body.image;
  var desc = req.body.description;
	var author = {
		id: req.user._id,
		username:	req.user.username
	}
	var newItem = {name: name, image: image, author: author, description: desc};

	// Create a new item to save to DB
	Item.create(newItem, (err, newlyCreated) => {
		if(err){
			console.log(err);
		} else {
			// redirect back to items page
			res.redirect("/items");
		}
	});
});

// Show - Show more info about one item
router.get("/:id", (req, res) => {
  Item.findById(req.params.id).populate("comments").exec((err, foundItem) => {
      if(err || !foundItem) {
        console.log(err);
				req.flash("error", "Item not found");
				res.redirect("/items");
      } else {
        // Find the item with provided ID
        res.render("items/show", {item: foundItem});
      }
  });
});

// Edit - Show form for editing item
router.get("/:id/edit", middleware.checkItemOwnership, (req, res) => {
	// User is logged in and owns item
	Item.findById(req.params.id, (err, foundItem) => {
		res.render("items/edit", {item: foundItem});
	});
});

// Update - Update item with given data
router.put("/:id", middleware.checkItemOwnership, (req, res) => {
	// User is logged in and owns item
	Item.findByIdAndUpdate(req.params.id, req.body.item, (err, updatedItem) => {
		if(err) {
			res.redirect("/items");
		} else {
			res.redirect("/items/" + req.params.id);
		}
	});
});

// Delete - Delete a item
router.delete("/:id", middleware.checkItemOwnership, (req, res) =>{
	// User is logged in and owns item
	Item.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.redirect("/items");
		} else {
			req.flash("success", "Item successfully deleted");
			res.redirect("/items");
		}
	});
});

module.exports = router;
