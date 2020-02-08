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




mongoose.connect('mongodb://localhost:27017/image',{useNewUrlParser:true,useUnifiedTopology:true});
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use("/public", express.static(__dirname + '/public'));

app.use(require("express-session")({
    secret:"hello world",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get('/secret',(req,res)=>{
    res.render('secret');
})

app.get('/register',(req,res)=>{
    res.render('register');
});
app.post('/register',(req,res)=>{
    User.register(new User({username:req.body.name}),req.body.password,function(err,user)
{
    if(err)
    {console.log(err);
    return res.render('register');
    }
    passport.authenticate('local')(req,res,function(){
        res.redirect('/secret');
    });
});
});

app.get('/login',(req,res)=>{
res.render('loginuser');
});
app.post('/login',passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),(req,res)=>{

});

app.listen(3000,()=>console.log("listening 3000"));