let player;
let bullets = [];
let enemies = [];
let score = 0;

function setup() {
  createCanvas(800, 600);
  player = new Player(width / 2, height - 50);
}

function draw() {
  background(0);

  player.display();
  player.update();

  // 更新並顯示子彈
  for (let bullet of bullets) {
    bullet.display();
    bullet.update();

    // 檢查子彈是否擊中敵人
    for (let enemy of enemies) {
      if (bullet.hits(enemy)) {
        score++;
        bullet.setToRemove();
        enemy.setToRemove();
      }
    }
  }

  // 移除標記為待刪除的子彈和敵人
  bullets = bullets.filter((bullet) => !bullet.toRemove);
  enemies = enemies.filter((enemy) => !enemy.toRemove);

  // 更新並顯示敵人
  for (let enemy of enemies) {
    enemy.display();
    enemy.update();

    // 檢查敵人是否擊中玩家
    if (enemy.hits(player)) {
      gameOver();
    }
  }

  // 顯示分數
  fill(255);
  textSize(20);
  text(`Score: ${score}`, 10, 30);

  // 隨機新增敵人
  if (frameCount % 60 === 0) {
    let x = random(width);
    let y = -50;
    let speed = random(1, 3);
    let enemy = new Enemy(x, y, speed);
    enemies.push(enemy);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    player.moveLeft();
  } else if (keyCode === RIGHT_ARROW) {
    player.moveRight();
  } else if (key === " ") {
    let bullet = new Bullet(player.x, player.y);
    bullets.push(bullet);
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 5;
  }

  display() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.width, this.height);
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.moveLeft();
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.moveRight();
    }
  }

  moveLeft() {
    this.x -= this.speed;
    this.x = constrain(this.x, 0, width - this.width);
  }

  moveRight() {
    this.x += this.speed;
    this.x = constrain(this.x, 0, width - this.width);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.speed = 10;
    this.toRemove = false;
  }

  display() {
    fill(255);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  update() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.toRemove = true;
    }
  }

  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < this.radius + enemy.radius;
  }

  setToRemove() {
    this.toRemove = true;
  }
}

class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.radius = 25;
    this.speed = speed;
    this.toRemove = false;
  }

  display() {
    fill(255);
    this.drawStar(this.x, this.y, this.radius, 5);
  }

  drawStar(x, y, radius, numPoints) {
    const angle = TWO_PI / numPoints;
    const halfAngle = angle / 2;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      const sx = x + cos(a) * radius;
      const sy = y + sin(a) * radius;
      vertex(sx, sy);
      const mx = x + cos(a + halfAngle) * (radius / 2);
      const my = y + sin(a + halfAngle) * (radius / 2);
      vertex(mx, my);
    }
    endShape(CLOSE);
  }

  update() {
    this.y += this.speed;
    if (this.y > height + this.radius) {
      this.toRemove = true;
    }
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < this.radius + player.width / 2;
  }

  setToRemove() {
    this.toRemove = true;
  }
}

function gameOver() {
  noLoop();
  fill(255);
  textSize(40);
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2);
}

// 開始遊戲
function startGame() {
  setup();
  loop();
}

// 重新開始遊戲
function restartGame() {
  player = null;
  bullets = [];
  enemies = [];
  score = 0;
  clear();
  startGame();
}


