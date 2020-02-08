const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app= express();
const mongoose = require('mongoose');
const image= require('./models/images');
const comment =require('./models/comment');
mongoose.connect('mongodb://localhost:27017/image',{useNewUrlParser:true,useUnifiedTopology:true});
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use("/public", express.static(__dirname + '/public'));



app.get('/',(req,res)=>{
res.render('front');
});

app.get('/gallery',(req,res)=>{
    var imgarr=image.find(function(err,db){
        if(err)
        {
            console.log("array not created !!");
        }else{
            res.render('gallery',{img:db});
        }

    });
  
});
app.post('/gallery',(req,res)=>
{  
    const namef= req.body.name;
    const linkf = req.body.link;
    const desc =req.body.description;
    image.create({
   
        name:namef ,
        link:linkf,
        desc:desc
     
 },function(err,db){
     if(err)
     {
         console.log("Error occured");
     }
     else{
         console.log(db);
     }
 });

    
    res.redirect('/gallery');

});
app.get('/gallery/:id',(req,res)=>{
   
   
    image.findById(req.params.id,function(err,db){
        if(err)
        {
            console.log("error occured during fetching by id");
        }
        else
        {
            comment.find({image_id:req.params.id},function(err,comments){
              if(err)
              {
                  console.log(err);
              }
              else{
                res.render('dispDet',{image:db,comments:comments});
              }

            });
          
        }
         
    });
    
     
}); 
app.get('/update/:id',(req,res)=>{
     image.findById(req.params.id,function(err,image)
    {  
        if(err){
        window.alert('some error occured');
        re.render('despDet');
        }
        else
        {
            res.render('update',{image:image});
        }
    });
  
});

app.post('/update/:id',(req,res)=>{ 
    const update= {
        name : req.body.name,
        link : req.body.link,
        desc : req.body.description
    };     
    image.findByIdAndUpdate(req.params.id,update,function(err,image)
{
    if(err)
    res.redirect('/gallery');
    else
    res.redirect('/gallery/'+req.params.id);
});

});

app.get('/delete/:id',(req,res)=>{
    
    image.findByIdAndDelete(req.params.id,function(err)
{ 
    if(err)
    {
        res.redirect('/gallery/'+req.params.id);
    }
    else{
        res.redirect('/gallery');
    }

})
     
});

app.get('/gallery/:id/comment',(req,res)=>{
  
    res.render('addcomment',{id:req.params.id});

});
app.post('/gallery/:id/comment',(req,res)=>{
    const author = req.body.author;
    const text = req.body.text;
    const id = req.params.id;
   comment.create({
       author: author,
       text: text,
       image_id : id
   },function(err,data){
             if(err)
                   console.log('comment not created ');
             else{
                 console.log(data);
             }
   });
    res.redirect('/gallery/'+req.params.id);
});

app.get('/addItem',(req,res)=>
{
 
    res.render('add-item');
});
app.listen(process.env.PORT || 3000,(port)=>{
 console.log("App is running at port "+(process.env.PORT || 3000));
});