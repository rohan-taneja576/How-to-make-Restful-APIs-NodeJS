const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model('Article', articleSchema);

// -----------------Request targeting all articles-----------------------------
app
  .route('/articles')
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send('successfully added a new article');
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send('successfully deleted all articles');
      } else {
        res.send(err);
      }
    });
  });

// -----------------End of Request targeting all articles-----------------------------

// -----------------Request targeting A Specific article-----------------------------

//the part with :articleTitle is worked as what we give after the articles route
//example -> request URL -> localhost:3000/articles/REST or whatever we want to get
app
  .route('/articles/:articletitle')
  // in this we have req.params.articletitle this will take the value after the articles
  // example -> suppose if we search localhost:3000/articles/REST
  // it will treated as like this (req.params.articletitle = "REST")
  // if we have "space" between the title then we can use ASCII encoding reference techniques
  //example localhost:3000/articles/jack%20bauer
  // it will treated as like this (req.params.articletitle = "Jack Bauer")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articletitle },
      function (err, foundArticle) {
        if (!err) {
          res.send(foundArticle);
        } else {
          res.send(err);
        }
      }
    );
  })

  .put(function (req, res) {
    Article.update(
      { title: req.params.articletitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send('successfully updated on article');
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.update(
      { title: req.params.articletitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send('Successfully updated one article');
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articletitle }, function (err) {
      if (!err) {
        res.send('Deleted Successfully');
      } else {
        res.send(err);
      }
    });
  });

// -----------------End of Request targeting A Specific article-----------------------------

app.listen('3000', () => {
  console.log('server started on Port 3000');
});
