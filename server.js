const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

// Require all models
const db = require('./models');

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();
app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

// MongoDB
mongoose.connect('mongodb://localhost/wowheadnewspop', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// Routes
// scrapper
app.get('/scrape', async function(req, res) {
  //  axios
  const response = await axios.get('http://www.wowhead.com');
  // then use cherrio
  const $ = cheerio.load(response.data);
  $('div.news-post-header-title-group').each(function(i, element) {
    const result = {};
    result.title = $(this)
        .first()
        .first()
        .text();
    result.link = $(this)
        .first()
        .children('a')
        .attr('href');
    console.log($(element));
    console.log(result);
    db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          //  error logging
          console.log(err);
        });
  });

  // Send a message to the terminal
  res.send('Scrape Complete');
});

// Route for getting all Articles
app.get('/api/articles', async function(req, res) {
  try {
    const data = await db.Article.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({error: {name: err.name, message: err.message}});
  }
});

//  Article by id
app.get('/api/articles/:id', async function(req, res) {
  try {
    const data = await db.Article.findOne({_id: req.params.id})
        .populate('note');
    res.json(data);
  } catch (err) {
    res.status(500).json({error: {name: err.name, message: err.message}});
  }
});
// route for updateing note
app.post('/api/articles/:id', async function(req, res) {
  // Creates a new note
  try {
    const dbNote = await db.Note.create(req.body);

    const dbArticle = await db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    res.json(dbArticle);
  } catch (err) {
    res.status(500).json({error: {name: err.name, message: err.message}});
  }
});

// Set the app to listen on PORT
app.listen(PORT, function() {
  console.log('App running on http://localhost:%s', PORT);
});
