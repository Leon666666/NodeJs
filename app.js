var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

users = [];
connections = [];

server.listen(3000,function(){
  console.log('server started on 3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);
  // disconnect
  socket.on('disconnect',function(data){
    users.splice(users.indexOf(socket.username),1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length)
 });
 // Send Message
 socket.on('send message', function(data){
   io.sockets.emit('new message', {msg: data, user:socket.username});
 });
 // new user
 socket.on('new user', function(data, callback){
   callback(true);
   socket.username = data;
   users.push(socket.username);
   updateUsernames();
 });

 function updateUsernames(){
   io.sockets.emit('get users', users);
 }
});
