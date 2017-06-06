var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/articlescraping');

var Article = mongoose.model("Article", { title: { type: String, unique: true }, link: { type: String, unique: true } });
module.exports = Article;
