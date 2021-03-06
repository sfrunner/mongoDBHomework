﻿var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var request = require("request");
var moment = require("moment");
var mongoose = require('mongoose');

//Package to Check DB for Unique Values
var uniqueValidator = require('mongoose-unique-validator');
mongoose.connect("mongodb://heroku_fz90mr50:u8cj135p96uqmci17l74u3auai@ds113282.mlab.com:13282/heroku_fz90mr50");
mongoose.plugin(uniqueValidator); 

//Import Models
var Article = require("../Models/articleScraping.js")
var Comment =  require("../Models/commentsModel.js")


router.get("/", function (req, res) {
    request("https://www.wsj.com", function (error, response, html) {
        var $ = cheerio.load(html);
        //Right Stories
        $(".lead-story").children().children().children().each(function (i, val) {
            if (val.children[0].children[0] != null) {
                if (val.children[0].children[0].name === "a") {
                    //Testing Link
                    console.log("Link");
                    console.log(val.children[0].children[0].attribs.href);
                    //Testing Title
                    console.log("Title");
                    console.log(val.children[0].children[0].children[0].data);

                    //Send Data to MongoDB via Mongoose
                    var article = new Article({ title: val.children[0].children[0].children[0].data, link: val.children[0].children[0].attribs.href, dateInserted: Date.now()});
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
                    var article = new Article({ title: val.children[0].children[0].children[0].data, link: val.children[0].children[0].attribs.href, dateInserted: Date.now() });
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
    Article.find({})
    .sort({dateInserted: -1})
    .limit(50)
    .exec(function(err, response){
        if (err) {
            console.log(err);
        }
        else{
            var data = {
                articles: response
            }
            res.render("blog", data);
        }
    });
});

//Retrieve all comments by Article ID
router.get("/comments/:articleId", function(req,res){
    Article.find({"_id": req.params.articleId})
    .populate("comments")
    .exec(function(err,response){
        console.log(response);
        res.json(response);
    });
});

//Add a Comment to DB
router.post("/addcomment", function(req,res){
    console.log(req.body);
    var comment = new Comment({ name: req.body.name, comment: req.body.comment, dateInserted: moment().format("LLLL") });
    comment.save(function (err,response) {
        console.log(response);
        if (err) {
            console.log(err);
        } else {
            Article.findByIdAndUpdate({"_id": req.body.articleId},{$push: {"comments": response._id}}, function(error, response){
                console.log("Comment Inserted");
            });
        }
    });
});

//Delete Comment from DB in Both Collections
router.delete("/deletecomment/:commentId", function(req,res){
    Comment.findByIdAndRemove({"_id": req.params.commentId}, function(error,response){
        Article.findOneAndUpdate({ "comments": req.params.commentId}, {$pull:{"comments": req.params.commentId}}, function(err,response){
            console.log(response);
            console.log("Comment Deleted");
        });
    });
});

module.exports = router;