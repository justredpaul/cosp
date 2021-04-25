import Phaser from "phaser";

export class BackgroundScene extends Phaser.Scene {
  constructor() {
    super({ key: 'bg-scene', active: true });
  }
  preload() {
    this.load.image('stars', 'stars.png');
  }
  create() {
    this.cameras.main.centerOn(0, 0);
    this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'stars');
    const starsLayerTwo = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'stars');
    starsLayerTwo.displayWidth = window.innerWidth * 1.5;
    starsLayerTwo.displayHeight = window.innerHeight * 1.5;
  }
}
