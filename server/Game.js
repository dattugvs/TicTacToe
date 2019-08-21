function Game(gameId, player1, player2)
{
    this.gameId = gameId;
    this.player1 = {
        name : player1.name,
        symbol : 'X',
        id : player1.id
    };
    this.player2 = {
        name : player2.name,
        symbol : 'O',
        id : player2.id
    };
    this.board = Array(9).fill(null);
    this.currTurn = 'X';
    this.isGameOver = false;
    this.winner = null;
}

Game.prototype.CheckWin = function()
{
    const winningChances = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < winningChances.length; i++)
    {
        const [a, b, c] = winningChances[i];
        if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c])
        {
            this.isGameOver = true;
            this.winner = this.board[a];
            return true;
        }
    }
    return false;
}

Game.prototype.MakeMove = function(playerId, boxNumber)
{
    if(this.isGameOver === true)
    {
        throw new Error("Game already completed");
    }

    var currPlayer = playerId === this.player1.id ? this.player1 : (playerId === this.player2.id ? this.player2 : null);
    if(currPlayer === null)
    {
        throw new Error("Invalid Player");
    }

    if(currPlayer.symbol !== this.currTurn)
    {
        throw new Error("Invalid Move");
    }

    if(this.board[boxNumber] === null)
    {
        this.board[boxNumber] = this.currTurn;
        this.currTurn = this.currTurn === 'X' ? 'O' : 'X';
        return this.CheckWin();
    }
}

module.exports = Game;