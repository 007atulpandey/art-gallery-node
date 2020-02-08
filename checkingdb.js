const mongoose =require('mongoose');
mongoose.connect("mongodb://localhost/login");

const perSchema = new mongoose.Schema({
    name : String,
    number : Number
    
});

const per=mongoose.model("Person",perSchema);

var perid = new per({
    name :"atul pandey",
    number:"8957790795"
});
perid.save(function(err,dp){
    if(err)
    {
        console.log("Error occured 404");

    }
    else{
        console.log(dp);
        console.log("evething is fine");
    }
});


