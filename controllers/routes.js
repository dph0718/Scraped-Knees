const express = require("express");
const router = express.Router();
const db = require("../models");
const cheerio = require('cheerio');
const axios = require('axios');

//delete route for deleting specific comment
router.delete(`/article/:articleId&:commentId`, function (req, res) {
    //find the comment with the particular id
    let commentId = req.params.commentId;
    let articleId = req.params.articleId;
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
    db.Comment.findOneAndRemove(commentConditions, data => {
    })
    db.Article.findOneAndUpdate(articleConditions, articleArg)
        .then(delArt => {
        })
    res.end();
});

//populates article with its comments.
router.get("/comment/:id", function (req, res) {
    let id = req.params.id;
    let conditions = {
        _id: id,
    };
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

// requests all Scraped Articles in db
router.get("/", function (req, res) {
    let allArticles;
    db.Article.find({}, (err, docs) => {
        allArticles = {
            results: docs,
        };
        res.render('index', allArticles)
    })
});

//scrapes articles and stores them in database.
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

module.exports = router;