import Phaser from 'phaser'
import { getClosestAsteroid } from '../functions/getClosestAsteroid';

const FUEL_TANK_LIMIT = 4000;
const PROBE_TOP_SPEED = 500;
const PROBE_ACCELERATION_SPEED = 200;
export const MAX_DRONES = 6;
export const DRONE_RADIUS = 300;

export class Probe extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    // Stats for UI
    this.fuel = 1000;
    this.tankCapacity = FUEL_TANK_LIMIT;

    this.speed = 200;

    this.drones = MAX_DRONES;
    this.miningList = new Set();

    this.dronesArea = scene.add.ellipse(x, y, DRONE_RADIUS * 2, DRONE_RADIUS * 2, 0x777777, 0.1);
    this.dronesArea.setOrigin(0.5, 0.5);
    scene.physics.add.existing(this.dronesArea);
    this.dronesArea.body.setCircle(300);

    this.spacecraft = scene.add.sprite(x, y, 'probe');
    this.spacecraft.setOrigin(0.5, 0.5);
    scene.physics.add.existing(this.spacecraft);
    scene.anims.create({
      key: 'engine_run',
      frames: scene.anims.generateFrameNumbers('probe',
        {
          start: 1,
          end: 4
        }),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: 'engine_down',
      frames: scene.anims.generateFrameNumbers('probe',
        {
          start: 0,
          end: 0
        }),
      frameRate: 0,
    });

    this.spacecraft.body.setDamping(true);
    this.spacecraft.body.setDrag(0.99);
    this.spacecraft.body.setMaxVelocity(PROBE_TOP_SPEED);
    this.spacecraft.body.setVelocity(this.speed, 0);

    this.add(this.dronesArea);
    this.add(this.spacecraft);

    this.keys = this.scene.input.keyboard.addKeys('M,R');
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  updateFuel(value) {
    this.fuel += 1 * value;

    if (this.fuel > FUEL_TANK_LIMIT) {
      this.fuel = FUEL_TANK_LIMIT;
    }

    this.scene.events.emit('fuel_changed', Math.ceil(this.fuel));
  };

  update() {
    this.dronesArea.x = this.spacecraft.x;
    this.dronesArea.y = this.spacecraft.y;

    if (this.fuel <= 0) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.M)) {
      if (this.drones === 0) return;

      const closest = getClosestAsteroid(this.scene);

      if (!closest) return;

      closest.asteroidBody.gameObject.mine();
      this.miningList.add(closest.asteroidBody);
      this.drones--;
      this.scene.events.emit('drones_changed', this.drones);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
      if (this.drones === MAX_DRONES) return;

      const closest = getClosestAsteroid(this.scene, false);

      if (!closest) return;

      if (closest.asteroidBody.gameObject.mining) {
        this.updateFuel(closest.asteroidBody.gameObject.resources);
        closest.asteroidBody.gameObject.stopMining();
        this.miningList.delete(closest.asteroidBody);

        this.drones++;
        this.scene.events.emit('drones_changed', this.drones);
      }
    }

    let isVelocityChanged = false;

    if (this.cursors.up.isDown) {
      this.spacecraft.anims.play('engine_run', true);
      this.updateFuel(-1);
      this.scene.physics.velocityFromRotation(this.spacecraft.rotation, PROBE_ACCELERATION_SPEED, this.spacecraft.body.acceleration);
      isVelocityChanged = true;
    } else {
      this.spacecraft.anims.play('engine_down', true);
      this.spacecraft.body.setAcceleration(0);
    }

    if (this.cursors.left.isDown) {
      this.updateFuel(-0.1);
      this.spacecraft.body.setAngularVelocity(-150);
      isVelocityChanged = true;
    } else if (this.cursors.right.isDown) {
      this.updateFuel(-0.1);
      this.spacecraft.body.setAngularVelocity(150);
      isVelocityChanged = true;
    } else {
      this.spacecraft.body.setAngularVelocity(0);
    }

    if (isVelocityChanged) {
      this.scene.events.emit('speed_changed', Math.ceil(this.spacecraft.body.speed));
    }
  }

  onEnterBlock(block) {
    if (this.lasTimeBlockEntered && performance.now() - this.lasTimeBlockEntered < 300) return;

    this.lasTimeBlockEntered = performance.now();
    if (block.planet) {
      const distance = Phaser.Math.Distance.Between(block.planet.x, block.planet.y, this.spacecraft.body.x, this.spacecraft.body.y);

      this.scene.events.emit('radio_changed', 5 - Math.floor(distance / 1200), block.planet);
    } else {
      this.scene.events.emit('radio_changed', 0);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('probe', function (x, y, texture) {
  const probe = new Probe(this.scene, x, y, texture);

  this.displayList.add(probe);

  return probe
});
