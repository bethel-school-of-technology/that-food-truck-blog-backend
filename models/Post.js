const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    // this is the name of the admin
    type: String,
  },
  avatar: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  social: {
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },

    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model('post', PostSchema);
