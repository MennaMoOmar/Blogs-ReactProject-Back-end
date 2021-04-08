const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

/* import models */
const User = require("../model/user");

/* import middleware */
const checkRequiredParams = require("../middleware/checkRequired");
const authenticationMiddleWare = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");

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
  validateRequest([
    body("username").isEmail(),
    body("password").isLength({ min: 5 }),
  ]),
  async (req, res, next) => {
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
      throw new CustomError("wrong username or password", 401);
    }
    const isMatch = await user.checkPassword(req.body.password);
    const token = await user.generateToken();
    console.log(isMatch);
    if (!isMatch) {
      throw new CustomError("wrong username or password", 401);
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

module.exports = router;
