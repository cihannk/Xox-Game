const GAME_STATE = { };
const Score = {
    isScoreAdded:false,
    xScore:0,
    oScore:0,
    AddScore(GAME_STATE){
        this.isScoreAdded = true;
        if (checkWinner(GAME_STATE) == "X"){
            Score.xScore++;
        }
        else{
            Score.oScore++;
        }
    
    },
    reRenderScores(){
        var scoreX = document.getElementById("xscore");
        var scoreY =  document.getElementById("oscore");
        scoreX.innerText = "X Score: "+this.xScore;
        scoreY.innerText = "O Score: "+this.oScore;
    },

}

function play (GAME_STATE,x, y) {
    if(isGameOver(GAME_STATE) || isSelectedFilled(GAME_STATE, x, y) )return GAME_STATE;
    GAME_STATE.board[y][x] = GAME_STATE.player == 1 ? "X" : "O";
    if(checkIfWinner(GAME_STATE) || isAllFilled(GAME_STATE)){
        GAME_STATE.isOver = true;
        return GAME_STATE;
    }
    changeTurn(GAME_STATE);
}

function changeTurn(GAME_STATE) {
    GAME_STATE.player = GAME_STATE.player == 1 ? 0 : 1
    return GAME_STATE;
}

function isSelectedFilled (GAME_STATE, x, y) {
     if (GAME_STATE.board[y][x] != null) {
         return true;
     }
     return false;
}

function isAllFilled(GAME_STATE) {
    for(let i = 0; i <3 ; i++){
        for(let j = 0; j<3; j++){
            if (isSelectedFilled(GAME_STATE, i, j) == false) return false;
        }
    }
    return true;
 }

function isGameOver(GAME_STATE) {

    if (checkIfWinner(GAME_STATE) || isAllFilled(GAME_STATE)){
        GAME_STATE.isOver = true;
        return true
    }
    return false;
}

function transposeBoard(board) {
    return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
}

function checkIfWinner(GAME_STATE) {
    const checkEvery = (line) => line.every(cell => cell === "X") || line.every(cell => cell === "O");
    const { board } = GAME_STATE;
    const transposedBoard = transposeBoard(board);
    const lineCheck = board => board.some(checkEvery);
    const crossCheck = board => checkEvery([board[0][0], board[1][1], board[2][2]]) || checkEvery([board[2][0], board[1][1], board[0][2]]);
    return lineCheck(board) || crossCheck(board) || lineCheck(transposedBoard);
}

function checkWinner(GAME_STATE){
    const { player }= GAME_STATE;
    return player == 1 ? "X" : "O";
}

function restartGame(GAME_STATE) {

    GAME_STATE.player = 1;
    GAME_STATE.board = [[null,null,null],
                        [null,null,null],
                        [null,null,null]];

    GAME_STATE.isOver = false;
    return GAME_STATE;
}

function restartButton(state, score){
    var winner = document.getElementById("winner");
    var button = winner.querySelector("button");
    button.addEventListener("click", (e)=> {
        restartGame(state);
        score.isScoreAdded = false;
        winner.querySelector("p").innerText = "Kazanan:";
        drawBoard(state);
    })
}

function scoreClear(Score){
    Score.oScore = 0;
    Score.xScore = 0;
    return Score
}

function scoreClearButton(Score){
    var resetButton = document.getElementById("reset-score");
    resetButton.addEventListener("click", (e)=>{
        scoreClear(Score);
        Score.reRenderScores();
    })
}

// UI


restartGame(GAME_STATE);
restartButton(GAME_STATE, Score);
scoreClearButton(Score);

var cells = document.querySelectorAll("td");
[...cells].forEach(cell => cell.addEventListener("click", e=>{
    play(GAME_STATE, e.target.dataset.x, e.target.dataset.y);
    drawBoard(GAME_STATE);
}))

function drawBoard(GAME_STATE) {
    console.log("drawboard");
    var table = document.getElementById("game");
    var winner = document.getElementById("winner");
    const draw = state => state.board.forEach((line, y) => line.forEach((cell, x) =>{
        var cellHtml = table.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        cellHtml.innerText = cell;
    }));

    draw(GAME_STATE);

    if(GAME_STATE.isOver && checkIfWinner(GAME_STATE) && !Score.isScoreAdded){
        console.log("winner");
        Score.AddScore(GAME_STATE);
        winner.querySelector("p").innerText = "Kazanan: "+checkWinner(GAME_STATE);
        Score.reRenderScores();
    }
    else if(isAllFilled(GAME_STATE)){
        winner.querySelector("p").innerText = "Kazanan: Berabere";
    }
}







