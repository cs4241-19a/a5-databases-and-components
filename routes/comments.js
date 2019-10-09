var express = require("express");
// Merge item and comment parameters
var router = express.Router({mergeParams: true});
var Item = require("../models/item");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Render new comment form
router.get("/new", middleware.isLoggedIn, (req, res) => {
  // Get item data and send it to template
  Item.findById(req.params.id, (err, item) => {
      if(err || !item) {
        console.log(err);
        req.flash("error", "Item not found");
        res.redirect("/items");
      } else {
        res.render("comments/new", {item: item});
      }
  });
});

// Create a new comment
router.post("/", middleware.isLoggedIn, (req, res) => {
  // Ensure item exists
  Item.findById(req.params.id, (err, item) => {
      if(err) {
        console.log(err);
        req.flash("error", "Item not found");
        req.redirect("/items");
      } else {
        Comment.create(req.body.comment, (err, comment) => {
          if(err) {
            req.flash("error", "Something went wrong");
            console.log(err);
          } else {
            // Add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;

            // Save comment
            comment.save();

            // Add comment to item
            item.comments.push(comment);
            item.save();
            req.flash("success", "Successfully added comment");
            res.redirect("/items/" + item._id);
          }
        })
      }
  });
});

// Show form for editing comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  // User is logged in and owns comment
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err) {
      res.redirect("/items/" + req.params.id);
    } else {
      res.render("comments/edit", {item_id: req.params.id, comment: foundComment});
    }
  })
});

// Update comment with given data
router.put("/:comment_id", middleware.checkCommentOwnership, (req,res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if(err) {
      res.redirect("/items/" + req.params.id);
    } else {
      res.redirect("/items/" + req.params.id);
    }
  });
});

// Delete a comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err) {
      res.redirect("/items" + req.params.id);
    } else {
      req.flash("success", "Comment successfully deleted");
      res.redirect("/items/" + req.params.id);
    }
  });
});

module.exports = router;
