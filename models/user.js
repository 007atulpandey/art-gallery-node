var mongoose =require('mongoose');
const localmongoose=require('passport-local-mongoose');

const UserSchema=new mongoose.Schema(
    {
        username:String,
        password:String
    }
);
UserSchema.plugin(localmongoose);
module.exports=mongoose.model("User",UserSchema);