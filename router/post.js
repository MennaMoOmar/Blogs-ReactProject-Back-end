/* imports npm */
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const sharp = require("sharp");

/* import models */
const User = require("../model/user");
const Post = require("../model/post");

/* import middleware */
const checkRequiredParams = require("../middleware/checkRequired");
const authenticationMiddleWare = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");
const validateImage = require("../middleware/validationImage");

/* import helpers */
const CustomError = require("../helpers/customError");

//get all posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (err) {
    err.statusCode = 442;
    next(err);
  }
});

//get all posts by user id
router.get("/allPosts/:id", async (req, res, next) => {
  try {
    const posts = await Post.find({userId: req.params.id});
    res.send(posts);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

//get all posts for login user
router.get("/allPosts", authenticationMiddleWare, async (req, res, next) => {
    try {
      const posts = await Post.find({userId: req.user.id});
      res.send(posts);
    } catch (err) {
      res.status(422).send({
        error: err,
        statusCode: 422,
      });
    }
  });

//add post
router.post(
  "/addPost",
  authenticationMiddleWare,
  checkRequiredParams(["title", "body"]),
  validateRequest([
    body("title").isLength({ min: 5, max: 20 }),
    body("body").isLength({ min: 5 }),
  ]),
  async (req, res, next) => {
    const createdPost = new Post({
      userId: req.user.id,
      title: req.body.title,
      body: req.body.body,
    });
    const post = await createdPost.save();
    res.status(200).send(post);
  }
);

//edit post
router.patch(
  "/:id",
  authenticationMiddleWare,
  checkRequiredParams(["title", "body"]),
  validateRequest([
    body("title").isLength({ min: 5, max: 20 }),
    body("body").isLength({ min: 5 }),
  ]),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      let post = await Post.findById(id);
      let updatedPost = await Post.findOneAndUpdate(id, {
        title: req.body.title || post.title,
        body: req.body.body || post.body,
      }).exec();
      res.send(updatedPost);
    } catch (err) {
      res.status(422).send({
        error: err,
        statusCode: 422,
      });
    }
  }
);

//get post by userid
router.get("/user/:id", async (req, res, next) => {
  try {
    const post = await Post.find({userId: req.params.id});
    res.send(post);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

//get post by id
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send(post);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

//delete post
router.delete("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.remove();
    res.status(200).send({ message: "post removed succesfuly" });
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

/* image */
const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload image"));
    }
    cb(undefined, true);
  },
});

//add image-auth
router.post(
  "/postImg",
  authenticationMiddleWare,
  upload.single("postImage"),
  async (req, res, next) => {
    const buffer = await sharp(req.file.buffer).png().toBuffer();
    req.post.image = buffer;
    await req.post.save();
    res.send({
      message: "image added successfully",
    });
  },
  validateImage
);

//delete image-auth
router.delete(
  "/postImg",
  authenticationMiddleWare,
  async (req, res, next) => {
    req.post.image = undefined;
    await req.post.save();
    res.send({
      message: "image deleted successfully",
    });
  }
);

//get image-auth
router.get("/postImg", authenticationMiddleWare, async (req, res, next) => {
  res.set("Content-Type", "image/png");
  res.send(req.post.image)
});

//get image by id
router.get("/postImg/:id", async (req, res, next) => {
  try {
    const post = await post.findById(req.params.id);
    if (!post || !post.image) {
      return res.status(422).send({
        error: "post not found",
        statusCode: 422,
      });
    }
    res.set("Content-Type", "image/jpg");
    res.send(post.image);
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});

module.exports = router;
