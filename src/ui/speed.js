import Phaser from "phaser";
import { UI_COLOR_NUM, UI_COLOR_STR } from '../scenes/ui';
import { getDegreesFromSpeed } from '../functions/getDegreesFromSpeed';

export class Speed extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.subscribed = false;

    scene.add.text(x + 30, y + 80, 'Speed', {
      font: '20px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.value = scene.add.text(x + 45, y + 50, '50', {
      font: '20px sans-serif',
      fill: UI_COLOR_STR,
    });

    this.graphic = scene.add.graphics();
    this.drawArc(50)
  }

  drawArc(speed) {
    this.graphic.clear();
    this.graphic.lineStyle(4, UI_COLOR_NUM, 1);
    this.graphic.beginPath();
    this.graphic.arc(this.x + 60, this.y + 60, 50, Phaser.Math.DegToRad(getDegreesFromSpeed(speed, 500)), Phaser.Math.DegToRad(140), true);
    this.graphic.strokePath();
  }

  update() {
    if (!this.subscribed) {
      const spaceScene = this.scene.scene.get('space-scene');
      if (!spaceScene.probe) return;

      this.subscribed = true;
      this.value.setText(spaceScene.probe.speed);
      this.drawArc(spaceScene.probe.speed);

      spaceScene.events.on('speed_changed', speed => {
        this.value.setText(speed);
        this.drawArc(speed);
      })
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('speed', function (x, y) {
  return this.displayList.add(new Speed(this.scene, x, y));
});
