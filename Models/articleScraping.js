﻿var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/articlescraping');

var Article = mongoose.model("Article", { title: { type: String, unique: true }, link: { type: String, unique: true }, comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}], dateInserted: {type: Date} });
module.exports = Article;
