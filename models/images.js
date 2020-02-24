var mongoose= require('mongoose');
var comment = require('../models/comment');
var image_schema = new mongoose.Schema({
   username:String ,
   userid:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'
   },
   link : String,
   description : String,
   title : String
    
});
module.exports= mongoose.model("image",image_schema);