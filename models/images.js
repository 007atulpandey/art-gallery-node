var mongoose= require('mongoose');
var comment = require('../models/comment');
var image_schema = new mongoose.Schema({
    name :String,
    link:String,
    desc:String,
});
module.exports= mongoose.model("image",image_schema);