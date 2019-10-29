const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const axios = require("axios");
const cheerio = require("cheerio");

let db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();


const Article = require("./models/Article");
const Comment = require("./models/comment");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


app.get("/", function (req, res) {
  res.send(index.html);
});
app.get("/scrape", function (req, res) {
  axios.get("http://www.echojs.com/").then(function (response) {
    let $ = cheerio.load(response.data);
    // console.log(response.data)

    $("article h2").each(function (i, element) {
      let result = {};
      result.title = $(this)
        .find("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete! Go back home to see articles");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

app.post("/articles/:id", function (req, res) {
  var comment = new Comment({
    title: req.body.title,
    body: req.body.body
  });

  comment.save().then(function (err, result) {
    if (err) {
      throw err
    } else {
      console.log(result);
    }
  })
  .catch(function (err) {
    console.log(err);
  });;

  console.log(mongojs.ObjectId(req.params.id))


  db.Article.updateOne(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $push: {
        comment: comment._id
      }
    }).then(function(result) {
      res.json(result)
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/articles/:id", function (req, res) {
  console.log(req.params.id)
  db.Article.find(
    {
      _id: req.params.id
    })
    .populate("comment").then(function (dbArticle) {
      res.json(dbArticle)
    });
});

app.get("/comments", function (req, res) {

  db.Comment.find({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

app.listen(PORT, function () {
  console.log("Scraper is scraping on port " + PORT + "!");
});