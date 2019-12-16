// require mongoose
const mongoose = require('mongoose');

// Save  reference Schema
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  comment: {
    type: Schema.Types.ObjectId,
    ref: 'comment',
  },
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model('Article', ArticleSchema);

// Export the Article model
module.exports = Article;
