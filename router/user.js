const express = require("express");
const router = express.Router();

const User = require("../model/user");

const checkRequiredParams = require("../middleware/checkRequired");
const authenticationMiddleWare = require("../middleware/authentication");
const { Error } = require("mongoose");

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
router.post("/", async (req, res, next) => {
  const createdUser = new User({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  });
  const user = await createdUser.save();
  res.status(200).send(user);
});

//login
router.post(
  "/login",
  checkRequiredParams(["username", "password"]),
  async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        const error = new Error("wrong username or password");
        error.statusCode = 401;
        throw error;
      }
      const isMatch = await user.checkPassword(req.body.password);
      const token = await user.generateToken();
      console.log(isMatch);
      if (!isMatch) {
        const error = new Error("wrong username or password");
        error.statusCode = 401;
        throw error;
      }
      res.json({
        user,
        token,
        succsess: "true",
      });
    } catch (err) {
      err.statusCode = 442;
      next(err);
    }
  }
);

//profile
router.get("/profile", authenticationMiddleWare, async (req, res, next) => {
  res.send(req.user);
});

module.exports = router;