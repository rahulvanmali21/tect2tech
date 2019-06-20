const express = require("express");
const router = express.Router();
const nodeMailer = require("nodemailer");
const config = require("../config/config");
const transmailer = nodeMailer.createTransport(config.mailer);

router.get("/",(req,res,next)=>{
    res.render("index",{title:"Tech2Tech | HOME "});
})
router.get("/about",(req,res,next)=>{
    res.render("about",{title:"Tech2Tech | ABOUT "});
});

router.route("/contact")
    .get((req,res,next)=>{
    res.render("contact",{title:"Tech2Tech | CONTACT US "});
    })
    .post((req,res,next)=>{
        const { name,email,message } = req.body;
        req.checkBody("name","name is required").notEmpty();
        req.checkBody("email","please enter a valid email id").isEmail();
        req.checkBody("message","please enter a valid message").notEmpty();
        let errorMessage = req.validationErrors();
        if(errorMessage){
            return res.render("contact",{
                 title:"Tech2Tech | CONTACT US ",
                 name,
                 email,
                 message,
                 errorMessage
             });
        }
        let mailOptions = {
            from:"tect2Tech<no-reply@Tect@eTech.com",
            to:config.mailer.auth.user,
            subject:`new vistor ${email}`,
            text:message
        }
        transmailer.sendMail(mailOptions,(err,info)=>{
            if(err) {console.log(err);}
            else{
            res.render("thankyou",{title:"Tech2Tech | CONTACT US ",name});
            }
        });
    });
module.exports = router;