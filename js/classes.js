class Background {
  constructor({ position, imgSrc }) {
    (this.position = position),
      (this.image = new Image()),
      (this.image.src = imgSrc);
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width,
      this.image.height
    );
  }

  update() {
    this.draw();
  }
}

class Shop {
  constructor({ position, imgSrc }) {
    (this.position = position),
      (this.image = new Image()),
      (this.image.src = imgSrc),
      (this.maxFrames = 6),
      (this.currentFrame = 0),
      (this.elapsed = 0),
      (this.hold = 5),
      (this.scale = 2.4);
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.currentFrame * (this.image.width / 6),
      0,
      this.image.width / 6,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / 6) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    if (this.elapsed % this.hold === 0)
      if (this.currentFrame < this.maxFrames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
  }

  update() {
    this.elapsed++;
    this.draw();
    this.animateFrames();
  }
}

class Player {
  constructor({
    position,
    velocity,
    height,
    width,
    offset,
    imgOffset,
    imgSrc,
    maxFrames,
    sprites,
  }) {
    (this.image = new Image()),
      (this.position = position),
      (this.velocity = velocity),
      (this.height = height),
      (this.width = width),
      (this.image.src = imgSrc),
      (this.scale = 2.5),
      (this.imgOffset = imgOffset),
      this.lastkey,
      (this.maxFrames = maxFrames),
      (this.attackBox = {
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        offset,
        width: 200,
        height: 50,
      }),
      this.isAttacking,
      (this.sprites = sprites),
      (this.currentFrame = 0),
      (this.elapsed = 0),
      (this.hold = 5),
      (this.isDead = false);
    this.health = 100;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgSrc;
    }
  }
  draw() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.maxFrames),
      0,
      this.image.width / this.maxFrames,
      this.image.height,
      this.position.x - this.imgOffset.x,
      this.position.y - this.imgOffset.y,
      (this.image.width / this.maxFrames) * this.scale,
      this.image.height * this.scale
    );

    //drawing the attack box
    // {
    //   ctx.fillStyle = 'blue';
    //   ctx.fillRect(
    //     this.attackBox.position.x,
    //     this.attackBox.position.y,
    //     this.attackBox.width,
    //     this.attackBox.height
    //   );
    // }
  }

  animateFrames() {
    if (this.elapsed % this.hold === 0)
      if (this.currentFrame < this.maxFrames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
  }

  update() {
    this.elapsed++;
    this.draw();
    if (!this.isDead) this.animateFrames();

    //attack boxes creation
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.switchSprites('attack');
    this.isAttacking = true;
  }

  switchSprites(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.maxFrames - 1) this.isDead = true;
      return;
    }

    if (
      this.image === this.sprites.attack.image &&
      this.currentFrame < this.maxFrames - 1
    )
      return;
    if (
      this.image === this.sprites.hit.image &&
      this.currentFrame < this.maxFrames - 1
    )
      return;
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.maxFrames = this.sprites.idle.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.maxFrames = this.sprites.run.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.maxFrames = this.sprites.jump.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.maxFrames = this.sprites.fall.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'attack':
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.maxFrames = this.sprites.attack.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'hit':
        if (this.image !== this.sprites.hit.image) {
          this.image = this.sprites.hit.image;
          this.maxFrames = this.sprites.hit.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.maxFrames = this.sprites.death.maxFrames;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
