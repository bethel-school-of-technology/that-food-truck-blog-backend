const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'admin',
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    // this is the name of the admin
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = Post = mongoose.model('post', Post);
