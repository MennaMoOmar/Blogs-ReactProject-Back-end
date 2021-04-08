/* imports */
const mongoose = require("mongoose");

/* schema */
const schema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  body: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    optional: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    optional: true,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Post = mongoose.model("Post", schema);
module.exports = Post;