const express = require("express");
const router = express.Router();
const {
  getUsers,
  getDoc,
  getUser,
  register,
  login,
  updateProfile,
  deleteUser,
  updateAvatar,
  searchUser,
} = require("../controllers/userControllers");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const auth = require("../middleware/auth");
const validateMiddleWare = require("../middleware/valiJoi");
const validateUser = require("../models/userSchema");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ storage });

//get Users
router.get("/", getUsers);
//get Doctors
router.get("/doctors/", getDoc);
//get User
router.get("/getuser/:id", getUser);
//Register User
router.post("/register", register);
//Login User
router.post("/login", login);

router.put("/update/:id", updateProfile);
//delete user
router.delete("/deleteuser/:id", deleteUser);
//update avatar
router.put("/uploadimg/:id", upload.single("userImg"), auth, updateAvatar);
//get all users and search
router.get("/search", auth, searchUser);
module.exports = router;
