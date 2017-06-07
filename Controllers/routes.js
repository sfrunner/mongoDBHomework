var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var request = require("request");

var mongoose = require('mongoose');

//Package to Check DB for Unique Values
var uniqueValidator = require('mongoose-unique-validator');
mongoose.connect('mongodb://localhost/articlescraping');
mongoose.plugin(uniqueValidator); 

var Article = require("../Models/articleScraping.js")
var Comment =  require("../Models/commentsModel.js")


router.get("/", function (req, res) {
    request("https://www.wsj.com", function (error, response, html) {
        var $ = cheerio.load(html);
        //Right Stories
        $(".lead-story").children().children().children().each(function (i, val) {
            if (val.children[0].children[0] != null) {
                if (val.children[0].children[0].name === "a") {
                    console.log("Link");
                    console.log(val.children[0].children[0].attribs.href);
                    console.log("Data Summary");
                    console.log(val.children[0].children[0].children[0].data);

                    //Send Data to MongoDB via Mongoose
                    var article = new Article({ title: val.children[0].children[0].children[0].data, link: val.children[0].children[0].attribs.href });
                    article.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Product Inserted");
                        }
                    });
                }
            }
        });

        //Left & Bottom Stories
        $(".lead-story").children().children().children().children().each(function (i, val) {
            if (val.children[0].children[0] != null) {
                if (val.children[0].children[0].name === "a") {
                    console.log("Link");
                    console.log(val.children[0].children[0].attribs.href);
                    console.log("Data Summary");
                    console.log(val.children[0].children[0].children[0].data);

                    //Send Data to MongoDB via Mongoose
                    var article = new Article({ title: val.children[0].children[0].children[0].data, link: val.children[0].children[0].attribs.href });
                    article.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Product Inserted");
                        }
                    });
                }
            }
        });
    });

    //Retrieve ALL stories from database and render on blog.handlebars
    Article.find({}, function(err, response){
        var data = {
            articles: response
        }
        res.render("blog", data);
    });
});

//Retrieve all comments by Article ID
router.get("/comments/:articleId", function(req,res){
    Comment.find({"articleId": req.params.articleId}, function(err,response){
        res.json(response);
    });
});
//Add a Comment to DB
router.post("/addcomment", function(req,res){
    console.log(req.body);
    var comment = new Comment({ name: req.body.name, comment: req.body.comment, articleId: req.body.articleId });
                    comment.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Comment Inserted");
                        }
                    });
})

module.exports = router;