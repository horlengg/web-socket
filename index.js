const io = require('socket.io')(8000, {
    cors: {
        origin: 'http://localhost:5173'
    }
})

var users = [];

io.on('connection', socket => {
    // when user disconnected
    socket.on("disconnect",()=>{

        console.log(socket.id + " disconnected");
        socket.nsp.emit("user_out",getUserId(socket.id))
        users = users.filter(user=> user.id != socket.id)
    })
    // when user is active
    socket.on('online',_id=>{
        _id && users.push({_id,id:socket.id})
        socket.join(_id)
        console.log("user id : " + _id + " join");
        console.log("user count : " + users.length)
        socket.nsp.emit("user-online",users)
    })
    // user send message
    socket.on("message",({message,sendTo})=>{
        socket.to(sendTo).emit("message-response",message)
    })
    socket.on("user-logout",_id=>{
        removeUser(_id)
        socket.nsp.emit("user_out",_id)
    })
})

const removeUser = _id=>{
    users = users.filter(user=> user._id != _id)
}
const getUserId = socket_id=>{
    return users.find(user => user.id == socket_id)?._id
}



/* noted  
- broadcast send to all but not self
- nsp send to all include selft
*/