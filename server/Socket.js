var games = [];
var player_queue = [];

var Game = require('./Game');

module.exports = function(io)
{
    io.on('connection', function(socket) {
        console.log("Socket connected - "+socket.id);

        socket.on('join game', function(name) {
            var player = {
                name : name,
                id : socket.id
            }
            player_queue.push(player);
            
            console.log(player_queue);
            if(player_queue.length > 1)
            {
                let gamePlayers = player_queue.splice(0,2);
                let player1 = gamePlayers[0];
                let player2 = gamePlayers[1];
                
                var newGame = new Game(games.length, player1, player2);
                games.push(newGame);

                io.to(player1.id).emit('start game', newGame);
                io.to(player2.id).emit('start game', newGame);
            }
            else
            {
                io.to(socket.id).emit('waiting', player);
            }
        });

        socket.on('make move', function(data) {
            var {gameId, index} = data;
            var moveResult = games[gameId].MakeMove(socket.id, index);
            const player1Id = games[gameId].player1.id;
            const player2Id = games[gameId].player2.id;
            if(moveResult === true)
            {
                io.to(player1Id).emit('game over', games[gameId]);
                io.to(player2Id).emit('game over', games[gameId]);   
            }
            else
            {
                io.to(player1Id).emit('make move', games[gameId]);
                io.to(player2Id).emit('make move', games[gameId]);

            }
        });
    });
}