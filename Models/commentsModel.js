var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/articlescraping');

var Comment = mongoose.model("Comment", { name: { type: String }, comment: { type: String }, articleId: {type: mongoose.Schema.Types.ObjectId, ref: "Article"} });
module.exports = Comment;
