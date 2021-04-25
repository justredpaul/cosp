import Phaser from "phaser";
import { UI_COLOR_NUM, UI_COLOR_STR } from '../scenes/ui';

const CONTROLS_WIDTH = 900;
const CONTROLS_HEIGHT = 100;

const CONTROLS_INSTRUCTION = `
[ M ] Mine closest asteroid;   [ R ] Receive fuel from asteroid;    [ Arrow Up ] Increase speed;

[ H ] Toggle this panel;          [ S ] Scan planet for life;            [ Arrow Left | Arrow Right ] Rotate spacecraft;`;

export class Controls extends Phaser.GameObjects.Container {
  constructor(scene, x) {
    super(scene, x - CONTROLS_WIDTH / 2, window.innerHeight - CONTROLS_HEIGHT - 20);

    this.graphics = scene.add.graphics();

    this.keys = scene.input.keyboard.addKeys('H');

    this.drawControls();
  }

  drawControls() {
    this.graphics.strokeColor = UI_COLOR_NUM;
    this.graphics.strokeAlpha = 1;
    this.graphics.strokeRoundedRect(this.x, this.y, CONTROLS_WIDTH, CONTROLS_HEIGHT, 10);
    this.graphics.fillStyle(0x040a19, 0.3);
    this.graphics.fillRoundedRect(this.x, this.y, CONTROLS_WIDTH, CONTROLS_HEIGHT, 10);

    this.instruction = this.scene.add.text(window.innerWidth / 2, this.y, CONTROLS_INSTRUCTION, {
      font: '18px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.instruction.setOrigin(0.5, 0);
  }

  hideControls() {
    this.graphics.clear();
    this.instruction.destroy();
    this.instruction = null;
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.H)) {
      if (this.instruction) {
        this.hideControls();
      } else{
        this.drawControls();
      }
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('controls', function (x, y) {
  return this.displayList.add(new Controls(this.scene, x, y));
});
