var userPoints = 0;
var computerPoints = 0;
var totalPoints = 0;
var currentPlayer;
var startingPlayer;
var board;
var madeMove;
var firstScore;
var movePoints;
var sum;

function startGame() {   
    startingPlayer = currentPlayer = firstPlayer();
    gameBoard();
    if(startingPlayer == "computer") {
        let tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.removeEventListener("click",userMove);
        })
        setTimeout(function(){computerMove(board);}, 1000);
    }
}

function restartGame() {
    var button = document.getElementById('button');
    button.innerHTML = "Restart?";
    button.style.backgroundColor = "#A7BEAE";
    button.disabled = false;
    document.getElementById('choosePlayer').style.display='block';
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.remove();
    })
    computerPoints = 0;
    userPoints = 0;
}

function returnWinner(){
    if(userPoints > computerPoints) {
        document.getElementById("winner").innerHTML = "Apsveicam, Jūs uzvarējāt spēli!";
        }
    else if(userPoints < computerPoints) {
        document.getElementById("winner").innerHTML = "Diemžēl šoreiz nepaveicās, dators vinēja!";
    } else if(userPoints = computerPoints) {
        document.getElementById("winner").innerHTML = "Neizšķirts, veiksmi nākamreiz!";
    }
    setTimeout(restartGame, 500);
    
}

function firstPlayer() {
    var button = document.getElementById('button');
    button.disabled = true;

    var select_menu = document.getElementById('option') 
    document.getElementById('choosePlayer').style.display='none';
    
    return select_menu.options[select_menu.selectedIndex].value;
}

function gameBoard() {
    totalPoints = 0;
    firstScore = 0;
    movePoints = 0;
    sum = 0;
    madeMove = 0;
    document.getElementById("computerMadeMove").innerHTML = "";
    document.getElementById("computerMadeMoveScore").innerHTML = "";
    document.getElementById("winner").innerHTML = "";
    board = ['5','4','7','9','2','6','3'];
    
    // Tiek izveidoti atseviški kvadrātu, kuros tiek ievietots katrs skaitlis no skaitļu virknes.
    for(let n = 0; n < board.length; n++) {
        let numberBlock = document.createElement("div");
        numberBlock.textContent = board[n];
        numberBlock.id = n.toString();
        numberBlock.classList.add("tile");
        numberBlock.addEventListener("click",userMove);
        document.getElementById("gameBoard").append(numberBlock);
    }
}

function checkGameEnd(board) {
    // Tiek pārbaudīts vai spēles laukumā paliek viens skaitlis, lai beigtu spēli.
    var count = 0;
    for(let i = 0; i < board.length; i++) {
        if(board[i] > 0) {
            count++;
        }
    }
    if(count == 1) {
        return true;
    }else{
        return false
    }
}

function replacableNumber(sum) {
    if(sum>9)
        return 3;
    else if(sum < 9)
        return 2;
    else
        return 4;
}

function userMove() {
    // Funkcija, kura pārbauda kādus skaitļus izvēlas summēt lietotājs + pievieno punktus spēlētājam/pretiniekam.
    let move = parseInt(this.id);
    movePoints = parseInt(this.innerHTML);
    madeMove++;
    // Spēlētāja pirmais izvēlētais skaitlis
    if(madeMove % 2 == 1) {
        firstScore = movePoints;
        board[move] = 0;
        document.getElementById(move).remove();
    }
    // Spēlētāja otrais izvēlētais skaitlis
    if(madeMove % 2 == 0) {
        sum = firstScore + movePoints;
        let replace = replacableNumber(sum);
        //playerTotalPoints(sum);
        document.getElementById(move).innerHTML = replace;
        board[move] = replace;
        let tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.removeEventListener("click", userMove);
        })
        if (sum > 9) {
            userPoints += 2;
            document.getElementById('userPointsArea').innerHTML = userPoints;
        }
        else if (sum < 9) {
            userPoints += 3;
            document.getElementById('userPointsArea').innerHTML = userPoints;
        }
        else {
            computerPoints -= 2;
            document.getElementById('computerPointsArea').innerHTML = computerPoints;
        
        }
        if(checkGameEnd(board) == true) {
            returnWinner();
            return;
        }   
        setTimeout(function(){computerMove(board);}, 500);
    }
}

function computerMove(check){
    selection = alphaBeta(check, [], true, computerPoints, -Infinity, +Infinity);
    let firstSelect = selection[1][0];
    let secondSelect = selection[1][1];
    let move = 0;
    sum = 0;
  
    move = parseInt(document.getElementById(firstSelect).id);
    firstScore = parseInt(document.getElementById(move).textContent);
    board[move] = 0;
    document.getElementById(move).remove();


    move = parseInt(document.getElementById(secondSelect).id);
    let secondScore = parseInt(document.getElementById(move).textContent);
    sum = firstScore + secondScore;
    let replace = replacableNumber(sum);

    document.getElementById(move).innerHTML = replace;
    document.getElementById("computerMadeMove").innerHTML = "Datora veiktais gājiens: " + firstScore + " + " + secondScore + " = " + sum;
    document.getElementById("computerMadeMoveScore").innerHTML = "Skaitļu kombinācija tika aizvietota ar: " + replace;
    board[move] = replace;
    let tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener("click",userMove);
    })   
    if (sum > 9) {
        computerPoints += 2;
        document.getElementById('computerPointsArea').innerHTML = computerPoints;
    }
    else if (sum < 9) {
        computerPoints += 3;
        document.getElementById('computerPointsArea').innerHTML = computerPoints;
    }
    else {
        userPoints -= 2;
        document.getElementById('userPointsArea').innerHTML = userPoints;
    
    }
    if(checkGameEnd(board) == true) {
        returnWinner();
        return;
    } 
}


function alphaBeta(state, move, maximizing, userPoints, computerPoints, alpha, beta) {
    var temp_state = state.slice()
    // MAX līmenis
    if(maximizing){
        var bestValue = -Infinity;
        var bestMove = null;
        var nextStates = [];
        var nextMoves = [];
        var nextScore = [];
        var APM = getMove(temp_state);
        nextStates = APM[0].slice();
        nextScore = APM[1].slice();
        nextMoves = APM[2].slice();
        // Tiek apskatīts katrs nākamais bērns un izvēlas iespējami labāko
        for(let i=0; i < nextStates.length; i++){
            var child = alphaBeta(nextStates[i], nextMoves[i], false, computerPoints + nextScore[i], alpha, beta);
            bestValue = Math.max(bestValue, child[0]);
            alpha = Math.max(alpha, bestValue);
            // Tiek veikta beta nogriešana
            if(beta<=alpha)
                break;
            if(child[0] == bestValue){
                bestMove = nextMoves[i];
            }
        }
        return [bestValue, bestMove]; // bestMove = Tiek atgriezts pirmais un otrais skaitlis ko dators izvēlēsies
    }
    // MIN līmenis
    else{
        var bestValue = Infinity;
        var bestMove = null;
        var nextStates = [];
        var nextMoves = [];
        var nextScore = [];
        var APM = getMove(temp_state);
        nextStates = APM[0].slice();
        nextScore = APM[1].slice();
        nextMoves = APM[2].slice();
        // Tiek apskatīts katrs nākamais bērns un izvēlas iespējami labāko
        for(let i=0; i < nextStates.length; i++){
            var child = alphaBeta(nextStates[i], nextMoves[i], true, computerPoints + nextScore[i], alpha, beta);
            bestValue = Math.min(bestValue, child[0]);
            beta = Math.min(beta, bestValue);
            // Tiek veikta beta nogriešana
            if(beta <= alpha)
                break;
            if(child[0] == bestValue){
                bestMove = nextMoves[i];
            }
        }
        return [bestValue, bestMove]; // bestMove = Tiek atgriezts pirmais un otrais skaitlis ko dators izvēlēsies
    }
}

function getMove(array){
    var theArray = []
    var points = []
    var moves = []
    for(let i = 0; i < array.length-1; i++){
        for(let j = array.length - 1; j>i; j--){
            let temp = array.slice();
            if(temp[i] != 0 && temp[j] !=0){
                sum = temp[i] + temp[j];
                temp[i] = replacableNumber(sum);
                temp[j] = 0;
                theArray.push(temp);
                points.push(gett(sum));
                moves.push([i,j])
            }
        }
    }
    return [theArray, points, moves];
}

function gett(sum) {
    points = 0
    if(sum>9)
        points += 2;
    else if(sum<9)
        points += 3;
    else
        points += 4;
    return points;
}