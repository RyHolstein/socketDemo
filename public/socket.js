

var socket = io.connect('http://localhost:4000');

//this is for the changes

var message = document.getElementById('text--message'),
    output = document.getElementById('page--container'),
    submit = document.getElementById('text--submit');


//emit events 

submit.addEventListener('click', function() {
     socket.emit('chat', {
         message: message.value,

     })
})

//listen for events 

socket.on('connected', function(data){
    Object.keys(data).forEach(function(key){
        console.log(data[key])
        var playerdata = data[key].player;
        var clientId = key;

        var div = document.createElement("div");
        div.id = clientId;
        div.className = 'player'
        div.style.backgroundColor = playerdata.color;
        div.style.left = playerdata.player_left+'px' 
        div.style.top = playerdata.player_top+'px' 

        document.getElementById('page--container').appendChild(div)
    })
})


socket.on('new_connection', function(data){
     
    var playerdata = data.player.player;
    var clientId = data.client;
    var div = document.createElement("div");
    div.id = clientId;
    div.className = 'player'
    div.style.backgroundColor = playerdata.color;
    div.style.left = playerdata.player_left+'px' 
    div.style.top = playerdata.player_top+'px' 

    document.getElementById('page--container').appendChild(div)
})




socket.on('player_movement', function(data) {
    var player = document.getElementById(data.client)
    player.style.left = data.player.player_left+"px";
    player.style.top = data.player.player_top+"px";
})




output.addEventListener('click', function(event){
    var x = String(event.clientX);     
    var y = String(event.clientY);
    data = {
        player_left: x,
        player_top: y
    }

    socket.emit('player_movement', data)

})


socket.on('player_left', function(data){
    console.log(data)
    document.getElementById(data).remove();
})