const router = require("express").Router()
const { spawn } = require('child_process');
const fs = require("fs")
router.post("/execute",(req,res)=>{

    let filename = "public/code/"+req.body.task +".py";
    let content = req.body.content
    fs.writeFile(filename,content,(err)=>{
        if(err) throw err;

        const ls = spawn('python3', [filename]);
        
        ls.stdout.on('data', (result) => {
          res.json({result:result.toString('utf-8')});
        });
        
        ls.stderr.on('data', (result) => {
           res.json({result:result.toString('utf-8')});            
        });
    });
    console.log( content);

});
router.get("/download/:taskId",(req,res)=>{
    let taskid = req.params.taskId;
    let filename = "public/code/"+taskid +".py";
    console.log(filename)
    res.download(filename,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("suceess")
        }
    });
})

module.exports = router