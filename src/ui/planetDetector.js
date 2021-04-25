import Phaser from 'phaser';

import { UI_COLOR_STR } from '../scenes/ui';

export class PlanetDetector extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.title = scene.add.text(x, y, 'Planet Detector', {
      font: '20px sans-serif',
      fill: UI_COLOR_STR,
    });

    this.wave = scene.add.sprite(x, y + 40, 'waves');
    this.wave.setOrigin(0, 0);

    scene.anims.create({
      key: 'waves_0',
      frames: scene.anims.generateFrameNumbers('waves',
        {
          start: 0,
          end: 0
        }),
      frameRate: 0,
      repeat: -1
    });
    scene.anims.create({
      key: 'waves_1',
      frames: scene.anims.generateFrameNumbers('waves',
        {
          start: 1,
          end: 2
        }),
      frameRate: 5,
      repeat: -1
    });
    scene.anims.create({
      key: 'waves_2',
      frames: scene.anims.generateFrameNumbers('waves',
        {
          start: 3,
          end: 4
        }),
      frameRate: 5,
      repeat: -1
    });
    scene.anims.create({
      key: 'waves_3',
      frames: scene.anims.generateFrameNumbers('waves',
        {
          start: 5,
          end: 6
        }),
      frameRate: 7,
      repeat: -1
    });
    scene.anims.create({
      key: 'waves_4',
      frames: scene.anims.generateFrameNumbers('waves',
        {
          start: 7,
          end: 8
        }),
      frameRate: 10,
      repeat: -1
    });
  }

  update() {
    if (!this.subscribed) {
      this.subscribed = true;

      const spaceScene = this.scene.scene.get('space-scene');
      spaceScene.events.on('radio_changed', radio => {
        this.wave.anims.play(`waves_${Math.min(radio, 4)}`, true);
      })
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('planetDetector', function (x, y) {
  return this.displayList.add(new PlanetDetector(this.scene, x, y));
});
