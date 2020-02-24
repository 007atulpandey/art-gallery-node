const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app= express();
const mongoose = require('mongoose');
const image= require('./models/images');
const comment =require('./models/comment');
const passport= require('passport'),
localStrategy=require('passport-local'),
localmongoose=require('passport-local-mongoose');
const User = require('./models/user');
const Google = require('./models/google');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


mongoose.connect('mongodb://localhost:27017/image',{useNewUrlParser:true,useUnifiedTopology:true});
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use("/public", express.static(__dirname + '/public'));

// session 
app.use(require("express-session")({
    secret: "i am Dark Matter",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport end

// google auth 
passport.use(new GoogleStrategy({
    clientID: '781585020585-p9i0lqq1eekmh4hqqfht9la806usnp8q.apps.googleusercontent.com',
    clientSecret: '3REzisxxaVWlAYA79D0f-09K',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
            Google.findOne({'google.id': profile.id}, function(err, user){
                if(err)
                    return done(err);
                if(user)
                    return done(null, user);
                else {
                    var newUser = new Google();
                    newUser.google.id = profile.id;
                    newUser.google.token = accessToken;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    })
                    console.log(profile);
                }
            });
        });
    }

));


app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/gallery' }),
  function(req, res) {
    res.redirect('/');
  });



  
app.use((req,res,next)=>{
    res.locals.current = req.user;
    next();
})





app.get('/',(req,res)=>{
    console.log(req.user);
res.render('front',{current: req.user});
});

/// login 
app.get('/login',(req,res)=>{
    res.render('log-up');
})
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/gallery",
        failureRedirect: "/register",
        // failureFlash: true,
        // successFlash: 'Welcome to YelpCamp!'
    }), function(req, res){
});
//logout
app.get("/logout", function(req, res){
    req.logout();
    // req.flash("success", "See you later!");
    res.redirect("/");
 });
/// *** register **********************

app.get('/register',(req,res)=>{
    res.render('log-up',{error : ""});
});

app.post("/register", function (req, res, next) {
    var newUser = new User({
        username: req.body.name
    });
    User.register(newUser, req.body.pass, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('log-up',{error:err.message});
        }

        // go to the next middleware
        next();

    });
}, passport.authenticate('local', { 
    successRedirect: '/gallery',
    failureRedirect: '/log-up' 
}));


// app.post('/register',(req,res)=>{
    
//     var newUser = new User({username: req.body.name});
//     User.register(newUser, req.body.pass, function(err, user){
//         if(err){
//             console.log(err);
//             return res.render("log-up", {error: err.message});
//         }
//         passport.authenticate("local")(req, res, function(){
//         //    req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
//            res.redirect("/gallery");
//         });
//     });
// });




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
   
        title:namef ,
        link:linkf,
        description:desc,
        username:req.user.username,
        userid:req.user._id
     
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
app.get('/update/:id',owner,(req,res)=>{
     image.findById(req.params.id,function(err,image)
    {  
        if(err){
        window.alert('some error occured');
        re.render('despDet');
        }
        else
        {
           if(req.user._id.equals(image.userid))
            res.render('update',{image:image});
            else
            {   
                res.redirect('/gallery');
            }

        }
    });
  
});

app.post('/update/:id',owner,(req,res)=>{ 
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

app.get('/gallery/:id/comment',isLoggedIn,(req,res)=>{
  
    res.render('addcomment',{id:req.params.id});

});
app.post('/gallery/:id/comment',isLoggedIn,(req,res)=>{
    const author = req.user.username;
    const text = req.body.text;
    const id = req.user._id;
    
   comment.create({
       username: author,
       text: text,
       userid : id,
       image_id:req.params.id
   },function(err,data){
             if(err)
                   console.log('comment not created ');
             else{
                 console.log(data);
             }
   });
    res.redirect('/gallery/'+req.params.id);
});

app.get('/addItem',isLoggedIn,(req,res)=>
{
    res.render('add-item');
});

// dashboard  . .. .. . 

app.get('/dashboard',isLoggedIn,(req,res)=>{
 
    comment.find({userid:req.user._id},(err,data)=>{
        if(err)
       {
           console.log(err);
           res.redirect('/');
       }
        console.log(data);
        image.find({userid:req.user._id},(err,img)=>{
            if(err)
            {
                console.log(err);
           res.redirect('/');
            }
            console.log(img);
            res.render('dashboard',{userdata:data,img:img});
        })
      
    })

})

// middle ware
function owner(req,res,next){
    console.log(req.body.current);
    next();

}
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }

    console.log('error', 'You must be signed in to do that!');
    res.render('log-up',{error:"Login or signup yourself first"});
  }
 


app.listen(process.env.PORT || 3000,(port)=>{
 console.log("App is running at port "+(process.env.PORT || 3000));
});