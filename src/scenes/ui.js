import Phaser from 'phaser';

import '../ui/fuel';
import '../ui/planetDetector';
import '../ui/speed';
import '../ui/scan';
import '../ui/scanResults';
import '../ui/controls';

export const UI_COLOR_NUM = 0xd8ebff;
export const UI_COLOR_STR = '#d8ebff';

export class UI extends Phaser.Scene {
  constructor() {
    super({ key: 'ui-scene', active: false });
  }
  preload() {
    this.load.spritesheet('waves',
      'waves.png',
      { frameWidth: 128, frameHeight: 32 }
    );
  }
  create() {
    this.fuelDisplay = this.add.fuel(10, 10);
    this.planetDetector = this.add.planetDetector(10, 80);
    this.speed = this.add.speed(10, 200);
    this.scan = this.add.scan(window.innerWidth - 10, 10);
    this.scanResults = this.add.scanResults(window.innerWidth / 2, 10);
    this.controls = this.add.controls(window.innerWidth / 2);
  }
  update() {
    this.fuelDisplay.update();
    this.planetDetector.update();
    this.speed.update();
    this.scan.update();
    this.controls.update();
  }
}
