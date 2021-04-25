import Phaser from "phaser";

import { Asteroid } from '../objects/asteroid';

export const spawnAsteroids = (scene, rect, count = 5) => {
  const asteroidGroup = scene.physics.add.group();

  asteroidGroup.runChildUpdate = true;

  for (let i = 0; i < count; i++) {
    const x = Phaser.Math.RND.between(rect.left, rect.left + rect.width);
    const y = Phaser.Math.RND.between(rect.top, rect.top + rect.height);

    asteroidGroup.add(
      new Asteroid(scene, x, y),
      true
    );
  }

  asteroidGroup.getChildren().forEach(asteroid => {
    asteroid.body.setSize(asteroid.rock.width, asteroid.rock.height);
  });


  scene.physics.add.collider(asteroidGroup);

  return asteroidGroup;
};
