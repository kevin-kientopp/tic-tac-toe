const xImg = new Image();
xImg.src = "x.png";
const oImg = new Image();
oImg.src = "o.png";
let turn = 0;
let context;

const startGame = () => {
  document.getElementById("winner").textContent = '';
  document.getElementById("replay").style = "display: none";

  const canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  const board = new Board();
  board.draw();

  const players = ['x', 'o'];
  turn = 0;
  canvas.onclick = e => {
    board.spaces.forEach(row => {
      row.forEach(space => {
        if (space.clicked(e)) {
          space.value = players[turn % 2];
          turn++;
        }
      });
    });

    board.draw();
    const result = board.result();
    if (result.gameOver) {
      if (result.winner) {
        document.getElementById("winner").textContent = `Congratulations! ${result.winner.toUpperCase()} won!`;
      } else {
        document.getElementById("winner").textContent = 'It was a tie! Thanks for playing!';
      }
      canvas.onclick = undefined;
      document.getElementById("replay").style = "display: block";
      return;
    }
  };

};
window.onload = startGame;

class Space {
  constructor(x, y, size = 100, value = '') {
    this.x = x;
    this.y = y;
    this.size = size;
    this.value = value;
  }

  draw() {
    switch(this.value) {
      case 'x':
        context.drawImage(xImg, this.x, this.y, this.size, this.size);
        break;
      case 'o':
        context.drawImage(oImg, this.x, this.y, this.size, this.size);
        break;
    }
  }

  clicked(e) {
    if (e.clientX > this.x && e.clientX <= this.x + this.size && 
      e.clientY > this.y && e.clientY <= this.y + this.size) {
      return true;
    }
    return false;
  }
}

class Board {
  constructor() {
    this.spaceSize = 100;
    this.lineThickness = 5;
    this.startX = 30;
    this.startY = 30;

    this.spaces = [
      [ new Space(this.startX, this.startY), new Space(this.startX + this.spaceSize + this.lineThickness, this.startY), new Space(this.startX + this.spaceSize * 2 + this.lineThickness * 2, this.startY) ],
      [ new Space(this.startX, this.startY + this.spaceSize + this.lineThickness), new Space(this.startX + this.spaceSize + this.lineThickness, this.startY + this.spaceSize + this.lineThickness), new Space(this.startX + this.spaceSize * 2 + this.lineThickness * 2, this.startY + this.spaceSize + this.lineThickness) ],
      [ new Space(this.startX, this.startY + this.spaceSize * 2 + this.lineThickness * 2), new Space(this.startX + this.spaceSize + this.lineThickness, this.startY + this.spaceSize * 2 + this.lineThickness * 2), new Space(this.startX + this.spaceSize * 2 + this.lineThickness * 2, this.startY + this.spaceSize * 2 + this.lineThickness * 2) ],
    ];
  }

  draw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "black";
    context.fillRect(this.startX + this.spaceSize, this.startY, this.lineThickness, this.spaceSize * 3 + 2 * this.lineThickness);
    context.fillRect(this.startX + this.spaceSize * 2, this.startY, this.lineThickness, this.spaceSize * 3 + 2 * this.lineThickness);
    context.fillRect(this.startX, this.startY + this.spaceSize, this.spaceSize * 3 + 2 * this.lineThickness, this.lineThickness);
    context.fillRect(this.startX, this.startY + this.spaceSize * 2, this.spaceSize * 3 + 2 * this.lineThickness, this.lineThickness); 
    
    this.spaces.forEach(row => {
      row.forEach(space => space.draw());
    });
  }

  result() {
    const getWinner = player => {
      if (this.spaces[0][0].value === player && this.spaces[0][1].value === player && this.spaces[0][2].value === player) {
        return player;
      }
      if (this.spaces[1][0].value === player && this.spaces[1][1].value === player && this.spaces[1][2].value === player) {
        return player;
      }
      if (this.spaces[2][0].value === player && this.spaces[2][1].value === player && this.spaces[2][2].value === player) {
        return player;
      }
      if (this.spaces[0][0].value === player && this.spaces[1][0].value === player && this.spaces[2][0].value === player) {
        return player;
      }
      if (this.spaces[0][1].value === player && this.spaces[1][1].value === player && this.spaces[2][1].value === player) {
        return player;
      }
      if (this.spaces[0][2].value === player && this.spaces[1][2].value === player && this.spaces[2][2].value === player) {
        return player;
      }
      if (this.spaces[0][0].value === player && this.spaces[1][1].value === player && this.spaces[2][2].value === player) {
        return player;
      }
      if (this.spaces[0][2].value === player && this.spaces[1][1].value === player && this.spaces[2][0].value === player) {
        return player;
      }
      return;
    };
    const winner = getWinner('x') || getWinner('o');

    if (winner) {
      return { gameOver: true, winner: winner };
    }

    if (turn >= 9) {
      return { gameOver: true };
    }

    return { gameOver: false };
  }
}