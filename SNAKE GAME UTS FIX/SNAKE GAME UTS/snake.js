const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images
const ground = new Image();
ground.src = "img/soil.webp";

const foodImg = new Image();
foodImg.src = "img/hellokitty.png";

const snakeHead = new Image();
snakeHead.src = "img/pink.jpg";

const snakeBody = new Image();
snakeBody.src = "img/lime.png";

const bombImg = new Image();
bombImg.src = "img/bom.png";

// load audio files
const dead = new Audio();
const eat = new Audio();
const move = new Audio();
const hissing = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
move.src = "audio/move.mp3";
hissing.src = "audio/hissing.mp3";

// create snake
let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

// create the food
let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

// create the bomb
let bomb = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

// Function to generate new position for bomb
function generateBombPosition() {
  bomb.x = Math.floor(Math.random() * 17 + 1) * box;
  bomb.y = Math.floor(Math.random() * 15 + 3) * box;
}

// Create the score var
let score = 0;

// get level
let levels = {
  easy: 200,
  medium: 100,
  hard: 50,
};
let level = levels.easy;

if (localStorage.getItem("snakeLevel")) {
  let storedLevel = JSON.parse(localStorage.getItem("snakeLevel"));
  level = levels[storedLevel];
}

// control the snake
document.addEventListener("keydown", direction);

let d;

function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT" && d != "LEFT") {
    move.play();
    d = "LEFT";
  } else if (event.keyCode == 38 && d != "DOWN" && d != "UP") {
    move.play();
    d = "UP";
  } else if (event.keyCode == 39 && d != "LEFT" && d != "RIGHT") {
    move.play();
    d = "RIGHT";
  } else if (event.keyCode == 40 && d != "UP" && d != "DOWN") {
    move.play();
    d = "DOWN";
  }
}

// check collision
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

// draw everything to the canvas

let game = setInterval(draw, level);

function draw() {
  ctx.drawImage(ground, 0, 0);
  ctx.fillStyle = "#F1EEDC";
  ctx.fillRect(0, 0, 19 * box, 3 * box);
  ctx.fillRect(0, 0, 1 * box, 19 * box);
  ctx.fillRect(18 * box, 0, 1 * box, 19 * box);
  ctx.fillRect(0, 18 * box, 19 * box, 1 * box);

  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.drawImage(snakeHead, snake[i].x, snake[i].y, box, box);
    } else {
      ctx.drawImage(snakeBody, snake[i].x, snake[i].y, box, box);
    }
  }

  ctx.drawImage(foodImg, food.x, food.y, box, box);
  ctx.drawImage(bombImg, bomb.x, bomb.y, box, box); // Draw the bomb

  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // which direction
  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // if the snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    // here we don't remove the tail
    score++;
    eat.play();

    // check if the new food position is in the snake array

    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
    
    // Generate new position for bomb when food is eaten
    generateBombPosition();
  } else {
    // remove the tail
    snake.pop();
  }

  // add a new head

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // game over rules
  if (
    snakeX < box ||
    snakeX > 17 * box ||
    snakeY < 3 * box ||
    snakeY > 17 * box ||
    collision(newHead, snake) ||
    (snakeX == bomb.x && snakeY == bomb.y) // Check collision with bomb
  ) {
    dead.play();
    clearInterval(game);
    // Game over logic here
  }
  snake.unshift(newHead);

  ctx.fillStyle = "black";
  ctx.font = "bold 30px Verdana"; // Example font family with bold
  ctx.fillText("SKOR = ", 2 * box, 2 * box);
  
  ctx.fillStyle = "black";
  ctx.font = "bold 30px Verdana"; // Example font family with bold
  ctx.fillText(score, 7 * box, 2 * box);
  
  ctx.fillStyle = "black";
  ctx.font = "bold 30px Verdana"; // Example font family with bold
  ctx.fillText("SNAKE GAME", 10 * box, 2 * box);
  
  
}
