const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

const background = new Background({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: './img/background.png',
});

const shop = new Shop({
  position: {
    x: 620,
    y: 172,
  },
  imgSrc: './img/shop.png',
});

const player = new Player({
  position: {
    x: 120,
    y: 120,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 30,
    y: 50,
  },
  width: 50,
  height: 150,
  maxFrames: 8,
  imgOffset: {
    x: 215,
    y: 156,
  },
  sprites: {
    idle: {
      imgSrc: './img/samurai/Idle.png',
      maxFrames: 8,
    },
    run: {
      imgSrc: './img/samurai/Run.png',
      maxFrames: 8,
    },
    jump: {
      imgSrc: './img/samurai/Jump.png',
      maxFrames: 2,
    },
    fall: {
      imgSrc: './img/samurai/Fall.png',
      maxFrames: 2,
    },
    attack: {
      imgSrc: './img/samurai/Attack1.png',
      maxFrames: 6,
    },
    hit: {
      imgSrc: './img/samurai/TakeHit2.png',
      maxFrames: 4,
    },
    death: {
      imgSrc: './img/samurai/Death.png',
      maxFrames: 6,
    },
  },
});

const enemy = new Player({
  position: {
    x: canvas.width / 2 + 190,
    y: 100,
  },
  color: 'red',
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -170,
    y: 50,
  },
  width: 50,
  height: 150,
  maxFrames: 8,
  imgOffset: {
    x: 215,
    y: 168,
  },
  sprites: {
    idle: {
      imgSrc: './img/kenji/Idle.png',
      maxFrames: 4,
    },
    run: {
      imgSrc: './img/kenji/Run.png',
      maxFrames: 8,
    },
    jump: {
      imgSrc: './img/kenji/Jump.png',
      maxFrames: 2,
    },
    fall: {
      imgSrc: './img/kenji/Fall.png',
      maxFrames: 2,
    },
    attack: {
      imgSrc: './img/kenji/Attack1.png',
      maxFrames: 4,
    },
    hit: {
      imgSrc: './img/kenji/TakeHit.png',
      maxFrames: 3,
    },
    death: {
      imgSrc: './img/kenji/Death.png',
      maxFrames: 7,
    },
  },
});

const keys = {
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

//collision functions
const checkRectCollision = ({ rect1, rect2 }) => {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
};

const bgSound = new Audio();
bgSound.src = './sounds/start.mp3';

const giveHit = new Audio();
giveHit.src = './sounds/giveHit.wav';

const giveHit2 = new Audio();
giveHit2.src = './sounds/giveHit2.mp3';

const run1 = new Audio();
run1.src = './sounds/run1.mp3';

const run2 = new Audio();
run2.src = './sounds/run2.mp3';

const takeHit = new Audio();
takeHit.src = './sounds/takeHit.wav';

const takeHit2 = new Audio();
takeHit2.src = './sounds/takeHit2.mp3';

const jumping = new Audio();
jumping.src = './sounds/jump_03.mp3';

const jump2 = new Audio();
jump2.src = './sounds/jump_01.mp3';

const death = new Audio();
death.src = './sounds/dead.wav';

const readyFight = new Audio();
readyFight.src = './sounds/readyFight.mp3';

readyFight.play();
// readyFight.volume = 1.5;

function animate() {
  requestAnimationFrame(animate);
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = 'black';

  background.update();
  shop.update();

  player.update();
  enemy.update();

  bgSound.play();
  bgSound.volume = 0.5;

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //enemy ground movements
  if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
    enemy.switchSprites('run');
    run1.play();
    run1.pause();
    if (enemy.position.x + enemy.width >= canvas.width) enemy.velocity.x = 0;
    else enemy.velocity.x = 5;
    run1.play();
  } else if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
    enemy.switchSprites('run');
    run1.play();
    run1.pause();
    if (enemy.position.x <= 0) enemy.velocity.x = 0;
    else enemy.velocity.x = -5;
    run1.play();
  } else {
    enemy.switchSprites('idle');
  }

  //player ground movements
  if (keys.d.pressed && player.lastkey === 'd') {
    player.switchSprites('run');
    run2.play();
    run2.pause();
    if (player.position.x + player.width >= canvas.width) player.velocity.x = 0;
    else {
      player.velocity.x = 5;
      run2.play();
    }
  } else if (keys.a.pressed && player.lastkey === 'a') {
    player.switchSprites('run');
    run2.play();
    run2.pause();
    if (player.position.x <= 0) player.velocity.x = 0;
    else {
      player.velocity.x = -5;
      run2.play();
    }
  } else {
    player.switchSprites('idle');
  }

  //enemy's aerial movement
  if (enemy.velocity.y < 0) {
    enemy.switchSprites('jump');
    jump2.play();
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites('fall');
  }

  //player's aerial movement
  if (player.velocity.y < 0) {
    player.switchSprites('jump');
    jumping.play();
  } else if (player.velocity.y > 0) {
    player.switchSprites('fall');
  }

  //collisions
  if (
    checkRectCollision({ rect1: player, rect2: enemy }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    enemy.switchSprites('hit');
    takeHit.play();
    player.isAttacking = false;
    enemy.health -= 5;

    enemyHealth.style.width = enemy.health + '%';
  }
  if (
    checkRectCollision({ rect1: enemy, rect2: player }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 1
  ) {
    player.switchSprites('hit');
    takeHit2.play();
    enemy.isAttacking = false;
    player.health -= 5;

    playerHealth.style.width = player.health + '%';
  }

  //check after swords being returned
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  if (player.health <= 0) {
    death.play();
    bgSound.src = '';

    setTimeout(() => {
      death.src = '';
    }, 3000);
    // death.src = '';
    player.switchSprites('death');
    determineWinner({ player, enemy });
    stopper();
    playerHealth.style.width = player.health;
  }
  if (enemy.health <= 0) {
    death.play();
    bgSound.src = '';
    setTimeout(() => {
      death.src = '';
    }, 3000);
    enemy.switchSprites('death');
    stopper();
    determineWinner({ player, enemy });
  }

  if (enemy.health === player.health && timer === 0) {
    bgSound.src = '';
  }
}

animate();
// death.pause();

addEventListener('keydown', (e) => {
  if (!player.isDead && !enemy.isDead && timer !== 0) {
    switch (e.key) {
      case 'ArrowUp':
        enemy.velocity.y = -18;
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastkey = 'ArrowLeft';
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastkey = 'ArrowRight';
        break;
      case 'ArrowDown':
        enemy.attack();
        giveHit2.play();
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastkey = 'a';
        break;
      case 'd':
        keys.d.pressed = true;
        player.lastkey = 'd';
        break;
      case 'w':
        player.velocity.y = -18;
        break;
      case ' ':
        player.attack();
        giveHit.play();
        break;
    }
  }
});

addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
});
