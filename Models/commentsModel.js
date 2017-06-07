var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/articlescraping');

var Comment = mongoose.model("Comment", { name: { type: String }, comment: { type: String }, dateInserted: {type: String}});
module.exports = Comment;
