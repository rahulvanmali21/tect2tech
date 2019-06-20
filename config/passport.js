const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const facebookStrategy = require("passport-facebook").Strategy;
const config = require("./config")
// Load User Model
const User = require('../models/User');
module.exports = function(passport){
    passport.serializeUser(function(user,done){
        done(null,user.id);
    })
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
        done(err,user);
        });
    });

    passport.use(
        new LocalStrategy(
            {usernameField:'email',passwordField:"password"},
            (email,password,done)=>{
        console.log(email,password); 
          User.findOne({email:email})
            .then(user =>{
                if(!user){
                    return done(null,false,{message:'Invalid email or password'});
                }
                console.log("user found");
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user);
                    }else{
                        return done(null,false,{message:"Invalid email or password"})
                    }
                });
            });  
        })
    );
    passport.use(new facebookStrategy({
        clientID:config.facebook.clientId,
        clientSecret:config.facebook.clientSecret,
        callbackURL:config.facebook.callbackUrl,
        profileFields:["id","displayName","email"]
    },(token,refreshToken,profile,done)=>{ 
        console.log(profile.id)
        User.findOne({facebookID:profile.id})
            .then(isUser =>{
                if(isUser){
                    return done(null,isUser);
                }else{
                    let user = new User();
                    user.name = profile.displayName
                    user.email = profile.id + "@facebook.com"
                    user.facebookID = profile.id
                    user.save((err)=>{
                        if(err)return done(null,false,{message:"cant save the user"});
                        return done(null,user);
                    })
                }
            })
    }
))
}