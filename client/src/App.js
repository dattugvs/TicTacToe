import React from 'react';
import Board from './Board';

const io = require('socket.io-client');
const serverUrl = "http://localhost:5000";
const socket = io(serverUrl);

const Game = {
	gameId : null,
	player1 : null,
	player2 : null,
	board : Array(9).fill(null),
	currTurn : null,
	isGameOver : false,
	winner : null,
	status : null
}

class App extends React.Component
{
	constructor()
	{
		super();
		this.state = {
			game : Game
		}
		this.name = ''
	}

	componentDidMount()
	{
		socket.on("waiting",    (player1) => {this.WaitForPlayer2(player1)});
		socket.on("start game", (game) => {this.StartGame(game)})
		socket.on("make move",  (game) => {this.MakeMove(game)})
		socket.on("game over",  (game) => {this.GameOver(game)})
	}

	GameOver(game)
	{
		var you = game.player1.id === socket.id ? game.player1 : game.player2;
		if(you.symbol === game.winner)
		{
			game["status"] = "You are winner";
		}
		else
		{
			game["status"] = "You lost the game";
		}

		this.setState({
			game : game
		});
	}

	MakeMove(game)
	{
		var currPlayerSymbol = game.player1.id === socket.id ? game.player1.symbol : game.player2.symbol;
		if(game.currTurn === currPlayerSymbol)
		{
			game["status"] = "Your Turn";
		}
		else
		{
			game["status"] = "Waiting for other player's turn";
		}
		this.setState({
			game : game
		});
	}

	WaitForPlayer2(player1)
	{
		var game = Game;
		game.player1 = player1;
		game.status = "Waiting for Player 2";
		this.setState({
			game : game
		});
	}

	StartGame(game)
	{
		if(game.player1.id === socket.id)
		{
			game["status"] = "Your Turn";
		}
		else
		{
			game["status"] = "Waiting for other player's turn";
		}

		// console.log(game);

		this.setState({
			game : game
		});
	}

	enterGame()
	{
		console.log("joing re");
		socket.emit("join game", this.name);
	}


	render()
	{
		const {game} = this.state;
		console.log(game);

		if(game.player1 === null)
		{
			return(
				<div>
					Your Name : <input type="text" name="name" placeholder="Enter Your Name" onChange={(e) => {this.changeName(e.target.value)}}></input>
					<button onClick={this.enterGame.bind(this)}>Enter a Game !!</button>
				</div>
			);
		}
		else
		{
			return(
				<div>
					<p>GameId : #{game.gameId}</p>
					<p>Status : {game.status}</p>
					<Board squares={game.board} onClick={(i) => this.makeMyMove(i)} />
				</div>
			);
		}
	}

	makeMyMove(i)
	{
		const game = this.state.game;
		var mySymbol = socket.id === game.player1.id ? 'X' : 'O';
		if(mySymbol === game.currTurn)
		{
			console.log("my move:"+i);
			socket.emit('make move', {gameId : game.gameId, index : i});
		}
		
		// socket.emit('make move', {boxNumber : i, symbol : game.currTurn});
	}

	changeName(newName)
	{
		this.name = newName;
	}
}
export default App;
