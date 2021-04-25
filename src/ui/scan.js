import Phaser from "phaser";
import { UI_COLOR_NUM, UI_COLOR_STR } from '../scenes/ui';

const SCAN_PROMPT_WIDTH = 500;
const SCAN_PROMPT_HEIGHT = 200;
const SCANNING_SPEED = 1;
const SCANNING_VOLUME = 2000;

export class Scan extends Phaser.GameObjects.Container {
  constructor(scene, right, y) {
    super(scene, right - SCAN_PROMPT_WIDTH, y);

    this.subscribed = false;
    this.scanning = false;
    this.right = right;
    this.promptDisplayed = false;

    this.scanKey = scene.input.keyboard.addKeys('S');
  }

  drawPrompt() {
    if (this.promptDisplayed || this.scanning) return;

    this.promptDisplayed = true;
    this.graphics = this.scene.add.graphics();
    this.graphics.strokeColor = UI_COLOR_NUM;
    this.graphics.strokeAlpha = 1;
    this.graphics.strokeRoundedRect(this.x, this.y, SCAN_PROMPT_WIDTH, SCAN_PROMPT_HEIGHT, 10);
    this.graphics.fillStyle(0x040a19, 0.3);
    this.graphics.fillRoundedRect(this.x, this.y, SCAN_PROMPT_WIDTH, SCAN_PROMPT_HEIGHT, 10);

    this.title = this.scene.add.text(this.x + SCAN_PROMPT_WIDTH / 2, this.y + 20, 'Planet scanner', {
      font: '20px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.title.setOrigin(0.5, 0);

    this.message = this.scene.add.text(this.x + SCAN_PROMPT_WIDTH / 2, this.y + 60, 'Look, you\'ve found a planet! We can scan it for' +
      ' the traces of life', {
      font: '16px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.message.setOrigin(0.5, 0);

    this.instruction = this.scene.add.text(this.x + SCAN_PROMPT_WIDTH / 2, this.y + 100, 'Press [ S ] to start scan', {
      font: '20px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.instruction.setOrigin(0.5, 0);

    this.warning = this.scene.add.text(this.x + SCAN_PROMPT_WIDTH / 2, this.y + 140, 'Warning: Stay close to the planet or process will' +
      ' be terminated', {
      font: '16px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.warning.setOrigin(0.5, 0);
  }

  hidePrompt() {
    if (!this.graphics) return;

    this.promptDisplayed = false;
    this.graphics.clear();
    this.title.destroy();
    this.message.destroy();
    this.instruction.destroy();
    this.warning.destroy();
  }

  startScan() {
    this.hidePrompt();

    this.scanning = true;
    this.scanningProgress = 0;

    this.title = this.scene.add.text(this.right-  10, this.y, 'Scanning', {
      font: '20px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.title.setOrigin(1, 0);
    this.progressBarShadow = this.scene.add.rectangle(this.right, this.y + 30, SCAN_PROMPT_WIDTH, 30, UI_COLOR_NUM, 0.1);
    this.progressBarShadow.setOrigin(1, 0);
    this.progressBar = this.scene.add.rectangle(this.right, this.y + 30, 0, 30, UI_COLOR_NUM);
    this.progressBar.setOrigin(1, 0);
  }

  stopScan() {
    this.scanning = false;

    this.title.destroy();
    this.progressBarShadow.destroy();
    this.progressBar.destroy();
  }

  update() {
    if (!this.subscribed) {
      this.subscribed = true;

      const spaceScene = this.scene.scene.get('space-scene');
      spaceScene.events.on('radio_changed', (radio, planet) => {
        if (this.planet !== planet) {
          this.planet = planet;
        }

        if (radio >= 4 && !this.planet.scanned) {
          this.drawPrompt();
        } else {
          if (this.promptDisplayed) {
            this.hidePrompt();
          }
          if (this.scanning) {
            this.stopScan();
          }
        }
      });
    }

    if (Phaser.Input.Keyboard.JustDown(this.scanKey.S)
      && this.promptDisplayed
      && !this.scanning) {
      this.startScan();
    }

    if (!this.scanning) return;

    this.scanningProgress += SCANNING_SPEED;

    if (this.scanningProgress >= SCANNING_VOLUME) {
      this.planet.scanned = true;

      if (this.planet.life) {
        this.scene.events.emit('win');
      } else {
        this.scene.events.emit('no_life');
      }

      this.stopScan();
    }

    this.progressBar.width = this.scanningProgress / SCANNING_VOLUME * SCAN_PROMPT_WIDTH;
    this.progressBar.setOrigin(1, 0);
  }
}

Phaser.GameObjects.GameObjectFactory.register('scan', function (x, y) {
  return this.displayList.add(new Scan(this.scene, x, y));
});
