/* imports */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

/* var */
const saltRounds = 7;
const signJWT = util.promisify(jwt.sign);
const jwtSecret = "mySecretKey";
const verifyJWT = util.promisify(jwt.verify);

/* schema */
const schema = new mongoose.Schema({
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
  phones: {
    type: String,
    default: "",
  },
});

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

const User = mongoose.model("User", schema);
module.exports = User;
