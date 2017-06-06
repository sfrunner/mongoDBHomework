var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var request = require("request");



router.get("/", function (req, res) {
    request("https://www.wsj.com", function (error, response, html) {
        //console.log(html);
        var $ = cheerio.load(html);
        $(".lead-story").children().children().children().children().children().children().each(function (i, val) {
            if (val.children[0] != null) {
                if (val.children[0].type === "text") {
                    console.log("Link");
                    console.log(val.children[0]);
                    console.log("Data Summary");
                    console.log(val.children[0].data);
                }
            }
        });
    });
});

module.exports = router;