const express = require("express");
const {
  addPost,
  getPosts,
  updatePost,
  updatePostImage,
  postLikes,
  getSinglePost,
  addComment,
  deletePost,
} = require("../controllers/postControllers");
const auth = require("../middleware/auth");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("../middleware/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ storage });

router.put("/likes/:id", auth, postLikes);
router.put("/comment/:id", auth, addComment);
router.post("/addpost", upload.single("picture"), auth, addPost);
// router.post("/addpost", upload.single("picture"), auth, addPost);
router.get("/", getPosts);
router.get("/getpost/:id", getSinglePost);
router.put("/update/:id", auth, updatePost);
router.put("/uploadimg/:id", upload.single("postImg"), auth, updatePostImage);
router.post("/delete/", auth, deletePost); //delete posts contain test

module.exports = router;
