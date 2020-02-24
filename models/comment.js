var mongoose = require("mongoose");
 // schema
var commentSchema = new mongoose.Schema({
    text: String,
    userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
     username : String,
     image_id:String
    
});
 
module.exports = mongoose.model("Comment", commentSchema);
