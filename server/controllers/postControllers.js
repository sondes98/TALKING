const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/postSchema");
const { postValidation } = require("../middleware/valiJoi");
var Fawn = require("fawn");
const task = Fawn.Task();

/**
 *@param<string>
 */
const addPost = async (req, res) => {
  try {
    const newBody = JSON.parse(req.body.info);
    //Validation
    const errors = [];
    const { error } = postValidation(newBody);
    if (error) {
      const { details } = error;
      details.forEach((item) => errors.push(item.message));
      return res.json({ status: 406, msg: errors });
    }
    const imageInfo = await cloudinary.uploader.upload(req.file.path);
    const newPost = await Post.create({
      title: newBody.title,
      description: newBody.description,
      author: req.userID,
      image: { imageURL: imageInfo.url, public_id: imageInfo.public_id },
    });
    res.json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate("author", "-password");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "-password -__v")
      .populate("comments.commentauthor", "-password -__v");
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updatePost = async (req, res) => {
  try {
    const { description, title } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
      description,
      title,
    });
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const updatePostImage = async (req, res) => {
  try {
    const imageInfo = await cloudinary.uploader.upload(req.file.path);
    const existPost = await Post.findById(req.params.id);
    cloudinary.uploader.destroy(existPost.image.public_id);
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
      image: { imageURL: imageInfo.url, public_id: imageInfo.public_id },
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const postLikes = async (req, res) => {
  try {
    const postId = req.params.id;
    const existPost = await Post.findById(postId);
    const existLike = await existPost.likes.find((like) => like == req.userID);
    if (existLike) {
      const updatedPost = await Post.findByIdAndUpdate(postId, {
        $pull: { likes: req.userID },
      });
      res.json(updatedPost);
    } else {
      const updatedPost = await Post.findByIdAndUpdate(postId, {
        $push: { likes: req.userID },
      });
      res.json(updatedPost);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const addComment = async (req, res) => {
  try {
    const { desc } = req.body;
    const newPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: { commentauthor: req.userID, desc } },
      },
      { new: true }
    )
      .populate("author")
      .populate("comments.commentauthor", "-password -__v");
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
//Fawn library
const deletePost = async (req, res) => {
  const { word } = req.body;
  //delete every title contains "word" in it
  const regex = new RegExp(word, "i"); // i for case insensitive
  // new Fawn.Task()
  new Fawn.Task()
    .remove("post", { title: regex })
    .run({ useMongoose: true })
    .then(function (results) {
      res.send(results);
      console.log(results);
    })
    .catch(function (err) {
      // Everything has been rolled back.
      // log the error which caused the failure
      res.status(500).json({ message: error });
    });
};

module.exports = {
  addPost,
  getPosts,
  getSinglePost,
  updatePost,
  updatePostImage,
  postLikes,
  addComment,
  deletePost,
};
