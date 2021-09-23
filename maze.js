var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

function Line(x, y, xTo, yTo) {
  this.x = x;
  this.y = y;
  this.xTo = xTo;
  this.yTo = yTo;
  ctx.beginPath();
  ctx.strokeStyle = "gold";
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.xTo, this.yTo);
  ctx.stroke();
}

function Rect(x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.w, this.h);
  ctx.stroke();
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var grid = [];
var current;
var size = 10;
var stack = [];

var cols;
var rows;
function Setup() {
  cols = canvas.width / size;
  rows = canvas.height / size;

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
}

Setup();

setInterval(function Draw() {
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  current.visited = true;
  current.head();
  // step1

  var next = current.CheckNeighbors();
  if (next) {
    next.visited = true;
    //step 2
    stack.push(current);

    //step 3

    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}, 1000 / 60);

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true]; /*[top,right,bottom,left] */
  this.visited = false;

  this.CheckNeighbors = function () {
    var neighbors = [];
    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    console.log(neighbors);
    if (neighbors.length > 0) {
      var r = Math.floor(Math.random() * neighbors.length);
      console.log(neighbors);
      return neighbors[r];
    } else {
      return undefined;
    }
  };

  this.head = function () {
    console.log("hello");
    var x = this.i * size;
    var y = this.j * size;
    Rect(x, y, size, size, "red");
  };

  this.show = function () {
    var x = this.i * size;
    var y = this.j * size;

    if (this.walls[0]) {
      Line(x, y, x + size, y);
    }
    if (this.walls[1]) {
      Line(x + size, y, x + size, y + size);
    }
    if (this.walls[2]) {
      Line(x + size, y + size, x, y + size);
    }
    if (this.walls[3]) {
      Line(x, y + size, x, y);
    }

    if (this.visited) {
      Rect(x, y, size, size, "green");
    }
  };
}

function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x == 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x == -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  var y = a.j - b.j;
  if (y == 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y == -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
