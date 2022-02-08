const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const highScoreDisplay = document.querySelector("#highscore");

/**
 * Variables to manage the board
 */
const boardWidth = 560;
const boardHeight = 3000;

/**
 * Variables for managing the blocks to destroy
 */
const blockWidth = 100;
const blockHeight = 20;

const horizontalBlocks = 5;
const verticalBlocks = 0;

/**
 * Variables for managing the user block
 */
const userStart = 230;
const userHeight = 10;
let currentPosition = userStart;

/**
 * Variables for managing the ball
 */
const ballDiameter = 20;
let timerId;
let ballSpeed = 100;
let xDirection = -2;
let yDirection = 2;
const ballStart = [270, 40];
let ballCurrentPosition = [...ballStart];

/**
 * Variables for managing the score
 */
let score = 0;
let highscore = 0;

//my block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    this.topLeft = [xAxis, yAxis + blockHeight];
  }
}

/**This is where the blocks are made. You control the position of them with the xAxis and the yAxis */
let blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
];

/**Den her kan udkommenteres når du har lavet funktionen til opg. 8 */
//populateBlocks();


//draw my blocks
/** Her skal vi tilføje en funktion der tilføjer vores blocks. Det laver vi i fællesskab */

//addBlocks();

//add user
const user = document.createElement("div");
user.classList.add("user");
//grid.appendChild(user);
drawUser();

//add ball
const ball = document.createElement("div");
ball.classList.add("ball");
grid.appendChild(ball);
drawBall();

//move user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition > 0) {
        currentPosition += 10;
        drawUser();
      }
      break;
    //Tilføj højre tast
  }
}
document.addEventListener("keydown", moveUser);

//draw User
function drawUser() {
  user.style.left = currentPosition + "px";
  user.style.bottom = userHeight + "px";
}

//draw Ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

//move ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

timerId = setInterval(moveBall, ballSpeed);

//check for collisions
function checkForCollisions() {
  //check for block collision
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score += 1;
      //Her kan scoren vises frem!

      //Inde i denne if skal opg 12 laves
      if (blocks.length == 0) {
        scoreDisplay.innerHTML = "You win!";
      }
    }
  }
  // check for wall hits
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter
  ) {
    changeDirection();
  }

  //check for user collision
  if (
    ballCurrentPosition[0] > currentPosition &&
    ballCurrentPosition[0] < currentPosition + blockWidth &&
    ballCurrentPosition[1] > userHeight &&
    ballCurrentPosition[1] < userHeight + blockHeight
  ) {
    changeDirection();
  }

  //game over
  if (ballCurrentPosition[1] <= 0) {

    //Her kunne highscore funktionaliteten laves.

    clearInterval(timerId);
    scoreDisplay.innerHTML = "You lose!";
    document.removeEventListener("keydown", moveUser);

  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}

function restartGame(resetScore) {
  // empty the playing field
  const elements = document.getElementsByClassName("block");

  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }

  ballCurrentPosition = [...ballStart];
  currentPosition = userStart;

  //Der mangler noget her... Noget med nogle funktioner der kaldes?

  xDirection = -2;
  yDirection = 2;

  if (resetScore) {
    score = 0;
    //Her kan scoren vises frem!
  }

  clearInterval(timerId);
  document.removeEventListener("keydown", moveUser);

  document.addEventListener("keydown", moveUser);
  timerId = setInterval(moveBall, ballSpeed);
}

let isPaused = false;
function checkForPause(e) {
  if (e.code === "Space") {
    isPaused = !isPaused;
    if (isPaused) {
      clearInterval(timerId);
      document.removeEventListener("keydown", moveUser);
    } else {
      document.addEventListener("keydown", moveUser);
      timerId = setInterval(moveBall, ballSpeed);
    }
  }

  if (e.code === "KeyF") {
    restartGame(true);
  }
}
document.addEventListener("keydown", checkForPause);