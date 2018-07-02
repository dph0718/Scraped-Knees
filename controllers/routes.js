const express = require("express");
const router = express.Router();
// const mongoose = require('mongoose');
const db = require("../models");
// const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

//delete route for deleting specific comment
router.delete(`/article/:articleId&:commentId`, function (req, res) {
    //find the comment with the particular id
    let commentId = req.params.commentId;
    let articleId = req.params.articleId;
    console.log('commentId:', commentId);
    console.log('articleId:', articleId);
    let commentConditions = {
        _id: commentId,
    }
    let articleConditions = {
        _id: articleId,
        // comment: commentId,
    }
    let articleArg = {
        $pull: { comments: commentId }
    }
    console.log('articleConditions.id:', articleConditions.id);
    db.Comment.findOneAndRemove(commentConditions, data => {
        console.log('removed the comment:', data);
    })

    db.Article.findOneAndUpdate(articleConditions, articleArg)
        .then(delArt => {
            console.log("removed from the article:", delArt)
        })
    res.end();
});

//test route for populating article with its comments.
router.get("/comment/:id", function (req, res) {
    let id = req.params.id;
    let conditions = {
        _id: id,
    };
    console.log(conditions._id);
    db.Article.find(conditions)
        .populate("comments")
        .then(data => {
            res.send(data)

        })
        .catch(err => console.log('an error?....'));
});

//route for posting a comment to the db.
router.post("/api/comment/:id", (req, res) => {
    console.log("i clikt it");
    console.log(req.body);
    let id = req.params.id;
    let conditions = {
        _id: id
    };
    let commentObj = req.body;
    db.Comment.create(commentObj)
        .then(posted => {
            return db.Article.findOneAndUpdate(conditions, { $push: { comments: posted._id } }, { new: true })
        })
    res.end();
});


//diagnostic route for getting within a promise. it works.
router.get("/test", (req, res) => {
    console.log("test worked.?");
    res.end;
})

//test route for loading all db stuff. [x] WOrks!!
router.get("/", function (req, res) {
    let allArticles;
    db.Article.find({}, (err, docs) => {
        allArticles = {
            results: docs,
        };
        res.render('index', allArticles)
        console.log('DB successfully accessed and rendered!')
    })
});




//dummy route to scrape knee articles from a harvard health search and place them in the db. [x] Works!!!
//it's a real route now.
router.get("/scrape", function (req, res) {
    let results = [];
    axios.get("https://www.health.harvard.edu/search?q=knee").then(response => {
        const $ = cheerio.load(response.data);
        $("div.search-result").each(function (i, element) {
            let title = $(element).find('a.result-title').text().trim();
            let link = $(element).find('a.result-title').attr('href');
            let content = $(element).find('div.result-excerpt').text().trim();

            let newArticle = {
                title: title,
                link: link,
                content: content,
                source: "health.harvard.edu"
            }
            results.push(newArticle);
        });
        db.Article.create(results,
            function (err, inserted) {
                if (err) {
                    console.log("err.code:", err.code);
                }
                else {
                    console.log('successfully inserted');
                }
                res.end();
            });
    })
});

//dummy route to post to an existing db Article [x] Works! And I learned how to use a few of Mongoose's Model methods and their parameters.
router.get("/", function (req, res) {
    let condition = { link: "A SECOND ONE!" };
    // db.Article.findOneAndUpdate(condition, {author: "e.e. cummings"}, (err, docs)=>console.log(docs));
    res.render("index", dummyArticle);

    // db.Article.update(condition, {author: "e.e. cummings"},{multi: true}, (err, docs)=>console.log(docs));
    db.Article.update(condition, { author: "Biloxi Bill" }, (err, raw) => {
        if (err) {
            console.log('biloxi bill not inserted')
        }
        console.log(raw);
    });
});

//dummy route to make sure handlebars works and page is rendered [x] Works!
router.get("/proof", function (req, res) {

    res.render("index", sampleEntry);
});

//dummy get route to check db posts: [x] Works!:
router.get("/db", function (req, res) {
    db.Article.create(dummyArticle);
    console.log(dummyArticle);
    res.render("index", sampleEntry);
});

//dummy route for scraping [x] Works!
// router.get("/scrape", function (req, res) {
//     // Make a request for the news section of `ycombinator`
//     request("https://news.ycombinator.com/", function (error, response, html) {
//         // Load the html body from request into cheerio
//         var $ = cheerio.load(html);
//         // For each element with a "title" class
//         $(".title").each(function (i, element) {
//             // Save the text and href of each link enclosed in the current element
//             console.log('found one');
//             var title = $(element).children('a.storylink').text();
//             console.log('this is the title:', title);
//             console.log('this is what goes for content:', dummyArticle.content);
//             // If this found element had both a title and a link
//             if (title) {
//                 dummyArticle["content"] = title;
//                 // Insert the data in the scrapedData db
//                 db.Article.create(dummyArticle,
//                     function (err, inserted) {
//                         if (err) {
//                             // Log the error if one is encountered during the query
//                             console.log(err);
//                         }
//                         else {
//                             // Otherwise, log the inserted data
//                             console.log(inserted);
//                         }
//                     });
//             } else i++;
//         });
//     });
//     res.render("index", sampleEntry);
// });

router.post("/articles", function (req, res) {
    db.Article.create(dummyArticle);
    console.log(dummyArticle);
    res.render("index", sampleEntry);
});

module.exports = router;