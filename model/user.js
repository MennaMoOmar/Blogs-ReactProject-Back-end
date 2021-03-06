/* imports */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const _ = require("lodash");

const {jwtSecret} = require('../config');
const Post = require('./post')

/* var */
const signJWT = util.promisify(jwt.sign);
const verifyJWT = util.promisify(jwt.verify);
const saltRounds = 7;

/* schema */
const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    firstname: {
      type: String,
      minlength: 3,
      maxlength: 10,
    },
    lastname: {
      type: String,
      minlength: 3,
      maxlength: 10,
    },
    phone: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    street: {
      type: String,
      default: "",
    },
    image: {
      type: Buffer
    }
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        _.omit(ret, ["__v", "password"]);
      }
    }
  }
);

/* hashing password */
schema.pre("save", async function () {
  const currentDocument = this;
  if (currentDocument.isModified("password")) {
    currentDocument.password = await bcrypt.hash(
      currentDocument.password,
      saltRounds
    );
  }
});

/* verify password */
schema.methods.checkPassword = function (plainPassword) {
  const currentDocument = this;
  return bcrypt.compare(plainPassword, currentDocument.password);
};

/* generate token */
schema.methods.generateToken = function () {
  const currentDocument = this;
  return signJWT(
    { id: currentDocument.id },
    jwtSecret
    // { expireIn: "1h" }
  );
};

/* verify token */
schema.statics.getUserFromToken = async function (token) {
  const User = this;
  const { id } = await verifyJWT(token, jwtSecret);
  const user = await User.findById(id);
  return user;
};

//relationship to Todo
schema.virtual('post', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'userId'
})

//return specific data
schema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.__v
  delete userObject.password
  delete userObject.image
  return userObject
}

const User = mongoose.model("User", schema);
module.exports = User;
