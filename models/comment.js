var mongoose = require("mongoose");
 // schema
var commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    image_id: String
});
 
module.exports = mongoose.model("Comment", commentSchema);
