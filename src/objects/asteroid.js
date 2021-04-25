import Phaser from 'phaser'

const MAX_FUEL = 1000;
const MINING_SPEED = 1;
const GRID_FRAMES = [8, 9, 10, 11, 12];
const MIN_ROTATION_SPEED = 0.1;
const MAX_ROTATION_SPEED = 3;

export class Asteroid extends Phaser.GameObjects.Ellipse {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.rotationSpeed = Phaser.Math.Between(MIN_ROTATION_SPEED, MAX_ROTATION_SPEED);
    this.iceCapacity = Phaser.Math.Between(MAX_FUEL * 0.1, MAX_FUEL);
    this.mining = false;
    this.resources = 0;
    this.rock = scene.physics.add.sprite(x, y, 'asteroids');
    this.rock.setFrame(Phaser.Math.Between(0, 6));
    this.rock.setOrigin(0.5, 0.5);
  }

  update() {
    if (this.mining) {
      if (!this.grid) {
        this.grid = this.scene.add.sprite(this.x - this.width / 2, this.y - this.height / 2, 'asteroids');
      }

      this.resources = Math.min(this.resources + MINING_SPEED, this.iceCapacity);
      const percentage = Math.floor(this.resources / this.iceCapacity * 100);
      this.grid.setFrame(GRID_FRAMES[Math.max(0, Math.floor(percentage / 20) - 1)]);
    } else {
      if (this.grid) {
        this.grid.destroy();
        this.grid = null;
      }
    }

    this.rock.angle += this.rotationSpeed;
    this.rock.x = this.body.x;
    this.rock.y = this.body.y;
  }

  mine() {
    this.mining = true;
    this.rock.alpha = 0.5;
  }

  stopMining() {
    this.mining = false;
    this.iceCapacity -= this.resources;
    this.resources = 0;
    this.rock.alpha = 1;

    if (this.iceCapacity === 0) {
      this.destroy();
    }
  }

  destroy() {
    super.destroy();

    this.rock.destroy();
    this.grid.destroy();
  }
}

Phaser.GameObjects.GameObjectFactory.register('asteroid', function (x, y) {
  return this.displayList.add(new Asteroid(this.scene, x, y));
});
