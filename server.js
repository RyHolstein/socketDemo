var express = require('express');
var socket = require('socket.io');
var app = express();

var server = app.listen(4000, function(){
    console.log('listening on port 4000');
})

app.use(express.static('public'))

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//socket-setup

var io = socket(server);

var clients = {}



io.on('connection', function(socket){
    socket.emit('connected', clients)
    var clientColor = getRandomColor();
   
    clients[socket.id] = {player:{
        player_left: '100', 
        player_top: '100',
        color: clientColor,
    }}
    
    console.log('someone has connected!!')
    io.sockets.emit('new_connection', {
        player: clients[socket.id],
        client: socket.id
    })
    


    socket.on('player_movement', function(data){
      
        var currentClient = clients[socket.id].player
        currentClient.player_left = data.player_left;
        currentClient.player_top = data.player_top;
        var newData = {
            client : socket.id,
            player: data
        }
        io.sockets.emit('player_movement', newData)
    })



    socket.on('disconnect', function() {
        io.sockets.emit('player_left', socket.id)
        console.log('someone has disconnected')
        delete clients[socket.id];
    });
    
})
