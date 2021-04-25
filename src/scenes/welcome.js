import Phaser from 'phaser';
import { UI_COLOR_NUM, UI_COLOR_STR } from './ui';

const PANEL_OFFSET = 100;

export class WelcomeScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'welcome-scene',
      active: true,
    });
  }

  create() {
    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0x040a19, 0.5);
    this.graphics.fillRoundedRect(PANEL_OFFSET, PANEL_OFFSET, window.innerWidth - PANEL_OFFSET * 2, window.innerHeight - PANEL_OFFSET * 2, 30);
    this.graphics.lineStyle(2, UI_COLOR_NUM, 1);
    this.graphics.strokeRoundedRect(PANEL_OFFSET, PANEL_OFFSET, window.innerWidth - PANEL_OFFSET * 2, window.innerHeight - PANEL_OFFSET * 2, 30);

    this.title = this.add.text(window.innerWidth / 2, PANEL_OFFSET + 50, 'COSP – Cosmos exploration game', {
      font: '34px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.title.setOrigin(0.5, 0);

    const messageText = `
    Hi! I'm V-Next. AI-powered spacecraft that looking for life forms on other planets. And I need your help!

    I've been traveling across the Universe for many decades, but still have no signs of life on other planets.
    
    
    Maybe you can help me with this search if I transfer control to you?
    
    
    I've almost run down for fuel, but there are a lot of asteroids with ice on them. 
    
    I can transform ice to oxygen and hydrogen to use them as fuel if you will collect some.
    `;
    this.message = this.add.text(window.innerWidth / 2, PANEL_OFFSET + 150, messageText, {
      font: '20px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.message.setOrigin(0.5, 0);

    this.instruction = this.add.text(window.innerWidth / 2, PANEL_OFFSET + 550, 'Press [ Enter ] to start', {
      font: '26px sans-serif',
      fill: UI_COLOR_STR,
    });
    this.instruction.setOrigin(0.5, 0);

    this.keys = this.input.keyboard.addKeys('ENTER');
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) {
      this.scene.start('space-scene');
      this.scene.start('ui-scene');

      this.scene.stop('welcome-scene');
    }
  }
}
