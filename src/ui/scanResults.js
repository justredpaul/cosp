import Phaser from "phaser";

import { UI_COLOR_NUM, UI_COLOR_STR } from '../scenes/ui';

const MESSAGE_BG_WIDTH = 400;
const MESSAGE_BG_HEIGHT = 100;

export class ScanResults extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.events.on('no_life', () => this.drawMessage());
    scene.events.on('win', () => this.drawMessage(true));

    this.graphics = scene.add.graphics();
  }

  drawMessage(hasLife = false) {
    const screenCenter = window.innerWidth / 2;

    this.graphics.strokeColor = UI_COLOR_NUM;
    this.graphics.strokeAlpha = 1;
    this.graphics.strokeRoundedRect(screenCenter - MESSAGE_BG_WIDTH / 2, this.y, MESSAGE_BG_WIDTH, MESSAGE_BG_HEIGHT, 10);
    this.graphics.fillStyle(0x040a19, 0.3);
    this.graphics.fillRoundedRect(screenCenter - MESSAGE_BG_WIDTH / 2, this.y, MESSAGE_BG_WIDTH, MESSAGE_BG_HEIGHT, 10);

    this.title = this.scene.add.text(screenCenter, this.y + 20, 'Scan results', {
      font: '20px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.title.setOrigin(0.5, 0);

    const messageText = hasLife
      ? 'Congratulations! There are forms of life on this planet'
      : 'No signs of life on this planet';
    this.message = this.scene.add.text(screenCenter, this.y + 60, messageText, {
      font: '16px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.message.setOrigin(0.5, 0);


    setTimeout(() => this.hideMessage(), 10000);
  }

  hideMessage() {
    if (!this.graphics) return;
    this.graphics.clear();
    this.title.destroy();
    this.message.destroy();
  }
}

Phaser.GameObjects.GameObjectFactory.register('scanResults', function (x, y) {
  return this.displayList.add(new ScanResults(this.scene, x, y));
});
