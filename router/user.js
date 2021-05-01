/* imports npm */
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const sharp = require("sharp");

/* import models */
const User = require("../model/user");

/* import middleware */
const checkRequiredParams = require("../middleware/checkRequired");
const authenticationMiddleWare = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");
const validateImage = require("../middleware/validationImage");

/* import helpers */
const CustomError = require("../helpers/customError");

//get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    err.statusCode = 442;
    next(err);
  }
});

//register
router.post(
  "/",
  checkRequiredParams(["username", "password", "firstname", "lastname"]),
  validateRequest([
    body("username").isEmail(),
    body("password").isLength({ min: 5, max: 20 }),
    body("firstname").isLength({ min: 3, max: 10 }),
    body("lastname").isLength({ min: 3, max: 10 }),
  ]),
  async (req, res, next) => {
    const { username } = req.body;
    let exists = await User.count({ username });
    if (exists) {
      return res
        .status(409)
        .send({ error: "Email already exists", statusCode: 409 });
    }
    const createdUser = new User({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
    });
    const user = await createdUser.save();
    res.status(200).send(user);
  }
);

//login
router.post(
  "/login",
  checkRequiredParams(["username", "password"]),
  async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      // throw new CustomError("wrong username or password", 401);
      res.status(401).send({
        error: "wrong username or password",
        statusCode: 401,
        succsess: "false",
      });
    }
    const isMatch = await user.checkPassword(req.body.password);
    const token = await user.generateToken();
    console.log(isMatch);
    if (!isMatch) {
      // throw new CustomError("wrong username or password", 401);
      res.status(401).send({
        error: "wrong username or password",
        statusCode: 401,
        succsess: "false",
      });
    }
    // const token = await user.generateToken();
    res.json({
      user,
      token,
      succsess: "true",
    });
  }
);

//profile
router.get("/profile", authenticationMiddleWare, async (req, res, next) => {
  res.send(req.user);
});

//get user by id
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

//edit profile
router.patch(
  "/profile",
  authenticationMiddleWare,
  checkRequiredParams(["firstname", "lastname"]),
  validateRequest([
    body("firstname").isLength({ min: 3, max: 10 }),
    body("lastname").isLength({ min: 3, max: 10 }),
  ]),
  async (req, res, next) => {
    const id = req.user.id;
    let user = await User.findById(id);
      await user.update({
      firstname: req.body.firstname || user.firstname,
      lastname: req.body.lastname || user.lastname,
      phone: req.body.phone || user.phone,
      country: req.body.country || user.country,
      city: req.body.city || user.city,
      street: req.body.street || user.street,
    }).exec();
    res.send(user)
    // let updatedUser = await User.findOneAndUpdate(id, {
    //   firstname: req.body.firstname || user.firstname,
    //   lastname: req.body.lastname || user.lastname,
    //   phone: req.body.phone || user.phone,
    //   country: req.body.country || user.country,
    //   city: req.body.city || user.city,
    //   street: req.body.street || user.street,
    // }).exec();
    // res.send(updatedUser);
  }
);

//delete profile
router.delete("/profile", authenticationMiddleWare, async (req, res, next) => {
  await req.user.remove();
  res.status(200).send({ message: "user removed succesfuly" });
});

/* image */
const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPG)$/)) {
      return cb(new Error("please upload image"));
    }
    cb(undefined, true);
  },
});

//add image-auth
router.post(
  "/profileImg",
  authenticationMiddleWare,
  upload.single("profileImage"),
  async (req, res, next) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
    req.user.image = buffer;
    await req.user.save();
    res.send({
      message: "image added successfully",
    });
  },
  validateImage
);

//delete image-auth
router.delete(
  "/profileImg",
  authenticationMiddleWare,
  async (req, res, next) => {
    req.user.image = undefined;
    await req.user.save();
    res.send({
      message: "image deleted successfully",
    });
  }
);

//get image-auth
router.get("/profileImg", authenticationMiddleWare, async (req, res, next) => {
  res.set("Content-Type", "image/png");
  res.send(req.user.image)
});

//get image by id
router.get("/profileImg/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.image) {
      return res.status(422).send({
        error: "user not found",
        statusCode: 422,
      });
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.image);
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});

module.exports = router;
