/* imports npm */
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");

/* import models */
const Image = require("../model/image");

/* import middleware */
const checkRequiredParams = require("../middleware/checkRequired");
const authenticationMiddleWare = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");

/* import helpers */
const CustomError = require("../helpers/customError");


//get all images
router.get("/", async (req, res, next) => {
  try {
    const images = await Image.find({});
    res.send(images);
  } catch (err) {
    err.statusCode = 442;
    next(err);
  }
});


module.exports = router;