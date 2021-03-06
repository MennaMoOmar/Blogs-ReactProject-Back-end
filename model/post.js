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
  image: {
    type: Buffer
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
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

//return specific data
schema.methods.toJSON = function () {
  const post = this
  const postObject = post.toObject()
  delete postObject.__v
  delete postObject.image
  return postObject
}

const Post = mongoose.model("Post", schema);

module.exports = Post;
