import Phaser from 'phaser';

import { BackgroundScene } from './scenes/background';
import { SpaceScene } from './scenes/space';
import { UI } from './scenes/ui';
import { WelcomeScene } from './scenes/welcome';

const init = () => {
  const config = {
    type: Phaser.AUTO,
    backgroundColor: 0x040a19,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        // debug: true,
        // debugShowBody: true,
        // debugShowStaticBody: true,
        // debugShowVelocity: true,
      }
    },
    scene: [BackgroundScene, SpaceScene, UI, WelcomeScene]
  };

  return new Phaser.Game(config);
};

game = init();
