/* imports */
const mongoose = require("mongoose");

/* schema */
const schema = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});

const Image = mongoose.model("Image", schema);
module.exports = Image;
