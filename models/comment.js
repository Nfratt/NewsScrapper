const mongoose = require('mongoose');
// same as artical.js
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
  title: String,
  body: String,
});
//  using mongoose's model method we create a model
const comment = mongoose.model('comments', CommentSchema);

// Export
module.exports = comment;
