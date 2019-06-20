'use strict'

const socketIO = require("socket.io");
const ot = require("ot");
let roomlist = {}
 
module.exports = (server)=>{
    let str = "##Lets go programmers \n \n";
    let io = socketIO(server);
    io.on("connection",(socket)=>{
        socket.on("joinRoom",(data)=>{
            if(!roomlist[data.room]){
                var socketIOServer = new ot.EditorSocketIOServer(str,[],data.room,function(socket,cd){
                    let self = this;
                    Task.findByIdAndUpdate(data.room,{content:self.document})
                        .then(()=>{
                            cd(true);
                        })
                        .catch(er=>{
                            cd(false);
                        }) 

                });
                roomlist[data.room] = socketIOServer;
            }
            roomlist[data.room].addClient(socket);
            roomlist[data.room].setName(socket,data.username)
            
            socket.room = data.room;
            socket.join(data.room)
        })
        socket.on("chatMessage",(data)=>{
            io.to(socket.room).emit("chatMessage",data);
        });
        socket.on("disconnect",()=>{
            socket.leave(socket.room);
        });
    })
}