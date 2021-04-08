/* imports npm */
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

/* import models */
const User = require("../model/user");
const Post = require("../model/post");

/* import middleware */
const checkRequiredParams = require("../middleware/checkRequired");
const authenticationMiddleWare = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");

/* import helpers */
const CustomError = require("../helpers/customError");

//get all users
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (err) {
    err.statusCode = 442;
    next(err);
  }
});

module.exports = router;