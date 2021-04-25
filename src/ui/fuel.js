import Phaser from 'phaser';

import { UI_COLOR_NUM, UI_COLOR_STR } from '../scenes/ui';

const TANK_WIDTH = 300;
const TANK_HEIGHT = 20;
const TANK_GAP = 5;
const TANKS_COUNT = 1;

export class Fuel extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.subscribed = false;

    scene.add.text(x, y, 'Fuel', {
      font: '20px sans-serif',
      fill: UI_COLOR_STR,
    });

    this.tanks = scene.add.group();
    for (let i = 0; i < TANKS_COUNT; i++) {
      const tankShadow = scene.add.rectangle(x + i * TANK_WIDTH + i * TANK_GAP, y + 30, TANK_WIDTH, TANK_HEIGHT, UI_COLOR_NUM, 0.2);
      tankShadow.setOrigin(0, 0);
      const tank = scene.add.rectangle(x + i * TANK_WIDTH + i * TANK_GAP, y + 30, TANK_WIDTH, TANK_HEIGHT, UI_COLOR_NUM);
      tank.setOrigin(0, 0);
      this.tanks.add(tank)
    }
  }

  drawTanks(fuel) {
    const spaceScene = this.scene.scene.get('space-scene');

    const barWidthPercent = fuel / spaceScene.probe.tankCapacity;
    const tanks = this.tanks.getChildren();

    // Simplification for single tank solution until upgrades available
    let lastNotEmpty = tanks[tanks.length - 1];
    lastNotEmpty.width = TANK_WIDTH * barWidthPercent;
  }

  update() {
    if (!this.subscribed) {

      const spaceScene = this.scene.scene.get('space-scene');
      if (!spaceScene.probe) return;

      this.drawTanks(spaceScene.probe.fuel);
      this.subscribed = true;

      spaceScene.events.on('fuel_changed', fuel => {
        this.drawTanks(fuel);
      });
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('fuel', function (x, y) {
  return this.displayList.add(new Fuel(this.scene, x, y));
});
