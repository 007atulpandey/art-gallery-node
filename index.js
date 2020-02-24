// const express = require('express');
// const ejs = require('ejs');
// const bodyParser = require('body-parser');
// const app= express();
// const image= require('./models/images');
// const comment =require('./models/comment');
// const mongoose = require('mongoose');
// const passport= require('passport'),
// localStrategy=require('passport-local'),
// localmongoose=require('passport-local-mongoose');
// const User = require('./models/user');
// const cookieParser = require('cookie-parser');



// mongoose.connect('mongodb://localhost:27017/image',{useNewUrlParser:true,useUnifiedTopology:true});
// app.set('view engine','ejs');
// app.use(bodyParser.urlencoded({extended:true}));
// app.use("/public", express.static(__dirname + '/public'));

// app.use(require("express-session")({
//     secret: "Once again Rusty wins cutest dog!",
//     resave: false,
//     saveUninitialized: false
// }));



// // app.use((req, res, next) => {
// //     if (req.cookies.user_sid && !req.session.user) {
// //         res.clearCookie('user_sid');        
// //     }
// //     next();
// // });
// // const sessionChecker = (req, res, next) => {
// //     if (req.session.user && req.cookies.user_sid) {
// //         res.redirect('/secret');
// //     } else {
// //         next();
// //     }    
// // };


// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.get('/', isLoggedIn, (req, res) => {
//     res.redirect('/login');
// });

// app.get('/home',(req,res)=>{
//     res.render('home');
// })


// app.get('/secret',isLoggedIn,(req,res)=>{
//     res.render('secret');
// })

// app.get('/register',(req,res)=>{
//     res.render('register');
// });
// app.post('/register',(req,res)=>{
    
//     var newUser = new User({username: req.body.username});
//     User.register(newUser, req.body.password, function(err, user){
//         if(err){
//             console.log(err);
//             return res.render("register", {error: err.message});
//         }
//         passport.authenticate("local")(req, res, function(){
//         //    req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
//            res.redirect("/secret"); 
//         });
//     });
// });
// app.get("/logout", function(req, res){
//     req.logout();
//     // req.flash("success", "See you later!");
//     res.redirect("/home");
//  });

// app.get('/login',(req,res)=>{
//     res.render('loginuser');
// })
// app.post("/login", passport.authenticate("local", 
//     {
//         successRedirect: "/secret",
//         failureRedirect: "/login",
//         // failureFlash: true,
//         // successFlash: 'Welcome to YelpCamp!'
//     }), function(req, res){
// });


// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     console.log('error', 'You must be signed in to do that!');
//     res.redirect('/login');
//   }



// app.listen(3000,()=>console.log("listening 3000"));