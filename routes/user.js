const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
// load model
const User = require("../models/User");
const Task = require("../models/Task");


router.get("/register",(req,res,next)=> res.render("register",{title:"Tech2Tech | REGISTER"}))
router.get("/login",(req,res,next)=> res.render("login",{title:"Tech2Tech | LOGIN"}))

router.post("/register",(req,res,next)=>{
        req.checkBody("name","name should have minimum 3 characters").isLength({min:3});
        req.checkBody("email","Please enter a valid email").isEmail();
        req.checkBody("password","password should have min 8 character").isLength({min:8});
        req.checkBody("password","passwords not matching").equals(req.body.confirm_password).notEmpty();
        let errorMessage = req.validationErrors();
        if(errorMessage){
            return res.render("register",{
                title:"Tech2Tech | REGISTER",
                errorMessage,
                name:req.body.name,
                email:req.body.email,
            });
        }
        const { name,email,password } = req.body;
        User.findOne({name}).then(isUser=>{
            if(isUser)  return res.render("register",{errorMessage:[{msg:"email already registered"}]});
            let newUser = new User();
            newUser.name = name;
            newUser.email = email;
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(password,salt,(err,hash)=>{ 
                  if(err) console.log(err);
                  newUser.password = hash;
                  newUser.save()
                    .then(() =>{
                        res.redirect("/account/login");
                    }) 
                    .catch(()=>{
                        res.render("register",{errorMessage:[{msg:"something went wrong please try again"}]});
                    });
                });
            });
        });
    });
router.post("/login",passport.authenticate('local', {
    failureRedirect: '/account/login',
    failureFlash:true
  }), function (req, res) {
    res.redirect('/account/profile');
  });
  
router.get("/auth/facebook",passport.authenticate("facebook",{
    scope:"email"}
));
router.get("/auth/facebook/callback",passport.authenticate("facebook",{
    successRedirect:'/account/profile',
    failureRedirect:'/account/login',
    failureFlash:true
}))

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('error', 'You are logged out');
    res.redirect('/account/login');
  });

router.get("/profile",ensureAuthenticated,(req,res)=>{
    Task.find({createBy:req.user.id})
    .then((tasks)=>{
        res.render("profile",{tasks});
    })
    
});

module.exports = router;