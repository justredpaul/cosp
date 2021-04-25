import Phaser from 'phaser';

import { Probe } from '../objects/probe';
import { spawnStartBlocks } from '../functions/spawnBlock';

export class SpaceScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'space-scene',
      active: false,
    });
  }

  preload() {
    this.load.spritesheet('planets',
      'planets.png',
      {
        frameWidth: 512,
        frameHeight: 512,
      });
    this.load.spritesheet('probe',
      'probe_sprite.png',
      {
        frameWidth: 168,
        frameHeight: 168,
      },
    );
    this.load.spritesheet('asteroids',
      'asteroids.png',
      {
        frameWidth: 128,
        frameHeight: 128,
      },
    );
  }

  create() {
    this.cameras.main.setZoom(0.4);
    this.cameras.main.centerOn(0, 0);

    /** @type {Probe} */
    this.probe = this.add.probe(0, 0);
    this.cameras.main.startFollow(this.probe.spacecraft, true, 0.09, 0.09);

    spawnStartBlocks(this);
  }

  update(dt) {
    this.probe.update(dt);
  }
}
