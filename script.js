// Board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Pig
let pigWidth = 34; 
let pigHeight = 24;
let pigX = boardWidth/8;
let pigY = boardHeight/2;
let pigImg;

let pig = {
    x : pigX,
    y : pigY,
    width: pigWidth, 
    height: pigHeight
}

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let pipePoint = new Audio('sounds/point.mp3');
let gameOverSound = new Audio('sounds/die.mp3');


let topPipeImg;
let bottomPipeImg;

// Game Physics
let velocityX = -2; // Pipe moving speed
let velocityY = 0; // Pig jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d'); // Board Drawing

    //load images
    pigImg = new Image();
    pigImg.src = "img/piggy.png";
    pigImg.onload = function() {
        context.drawImage(pigImg, pig.x, pig.y, pig.width, pig.height);
    }
     
    topPipeImg = new Image();
    topPipeImg.src = "img/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "img/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener('keydown', movePig);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Pig
    velocityY += gravity;
    pig.y = Math.max(pig.y + velocityY,  0); // apply gravity to current pig.y
    context.drawImage(pigImg, pig.x, pig.y, pig.width, pig.height);

    if (pig.y > board.height) {
        gameOver = true;
        gameOverSound.play();
    }

    // Pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && pig.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
            pipePoint.play();
        }

        if (detectCollision(pig, pipe)) {
            gameOver = true;
            gameOverSound.play();
        }
    }

    // Clear pipes 
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // Remove first element from array
    }

    // Score 
    context.fillStyle = "white";
    context.font = "45px sans-seriff";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText('GAME OVER', 45, 320);
    }
}

function placePipes(){
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random() *(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed : false
    }

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

function movePig(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // Jump Button
        velocityY = -6;

        // Reset Game
        if (gameOver) {
            pig.y = pigY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
