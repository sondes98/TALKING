const mongoose = require("mongoose");
const schema = mongoose.Schema;
const joi = require("joi");

const postSchema = new schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  image: {
    imageURL: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  comments: [
    {
      commentOwner: { type: mongoose.Types.ObjectId, ref: "user" },
      desc: String,
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

module.exports = mongoose.model("post", postSchema);

// const Post = mongoose.model("post", postSchema);
// module.exports = { Post, postValidation };
