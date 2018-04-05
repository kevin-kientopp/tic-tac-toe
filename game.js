const xImg = new Image();
xImg.src = 'x.png';
const oImg = new Image();
oImg.src = 'o.png';
let canvas;
let context;
let ps;

const startGame = () => {

  document.getElementById('winner').textContent = '';
  document.getElementById('replay').style = 'display: none';
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  ps = new PubSub();

  const game = new Game();
  game.refresh();

  canvas.onclick = e => {
    game.doTurn(e);
    game.refresh();
    game.checkResult();
  };

};
window.onload = startGame;

class Game {

  constructor() {
    this.turn = 0;
    this.board = new Board();
    this.players = ['x', 'o'];
    ps.subscribe('turnOver', () => {
      this.turn++;
    });
  }

  refresh() {
    this.board.draw();
  }

  doTurn(e) {
    this.board.spaces.forEach(row => {
      row.forEach(space => {
        if (space.clicked(e)) {
          ps.publish('clicked', { space: space, player: this.players[this.turn % 2] });
        }
      });
    });
  }

  checkResult() { 
    const winner = this.board.winner();
    if (winner || this.turn >= 9) {
      if (winner) {
        document.getElementById('winner').textContent = `Congratulations! ${winner.toUpperCase()} won!`;
      } else if (this.turn >= 9) {
        document.getElementById('winner').textContent = 'It was a tie! Thanks for playing!';
      }
      canvas.onclick = undefined;
      document.getElementById('replay').style = 'display: block';
    }
  }
}

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

class PubSub {
  constructor() {
    this.subs = {};
  }

  subscribe(channel, sub) {
    this.subs[channel] = this.subs[channel] || [];
    this.subs[channel].push(sub);
  }

  publish(channel) {
    const args = [].slice.call(arguments, 1);
    this.subs[channel].forEach(sub => {
      sub.apply(void 0, args);
    });
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
    this.spaces.forEach(row => row.forEach(space => ps.subscribe('clicked', e => {
      if (e.space === space && !space.value) {
        space.value = e.player;
        ps.publish('turnOver');
      }
    })));
  }

  draw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = 'black';
    context.fillRect(this.startX + this.spaceSize, this.startY, this.lineThickness, this.spaceSize * 3 + 2 * this.lineThickness);
    context.fillRect(this.startX + this.spaceSize * 2, this.startY, this.lineThickness, this.spaceSize * 3 + 2 * this.lineThickness);
    context.fillRect(this.startX, this.startY + this.spaceSize, this.spaceSize * 3 + 2 * this.lineThickness, this.lineThickness);
    context.fillRect(this.startX, this.startY + this.spaceSize * 2, this.spaceSize * 3 + 2 * this.lineThickness, this.lineThickness); 

    this.spaces.forEach(row => {
      row.forEach(space => space.draw());
    });
  }

  winner() {
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
    };
    return getWinner('x') || getWinner('o');
  }
}
