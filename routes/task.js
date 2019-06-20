const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.get("/createTask",(req,res,next)=>{
    let newtask = new Task({
        createBy:req.user.id
    });
    
    newtask.save()
        .then((data)=>{
            console.log("redirecting");
            res.redirect("/task/mytask/" + data.id);
        })
        .catch(err=>{
            console.log("saving task error");
            res.render("error")
        });
});

router.get("/mytask/:id",(req,res)=>{
    if(req.params.id){
        Task.findById(req.params.id)
            .then(task=>{
                if(task){
                    console.log("found")
                    res.render("task",{data:task.content,roomId:task.id});
                }else{
                    console.log("task not found")
                     res.render("error");
                }
            })
            .catch(err=>{
                res.render("error");
            });
    }else{
        res.render("error");
    }
});
module.exports = router;