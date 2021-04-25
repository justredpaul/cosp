import Phaser from 'phaser'

import { getRandomPlanet } from '../functions/getRandomPlanet';

export class Planet extends Phaser.GameObjects.Ellipse {
  constructor(scene, x, y, radius) {
    super(scene, x, y);

    const {
      base,
      land,
      atmosphere,
      life,
    } = getRandomPlanet();

    this.life = life;

    this.base = scene.add.sprite(x, y, 'planets');
    this.base.displayWidth = radius * 2;
    this.base.displayHeight = radius * 2;
    this.base.setFrame(base);
    this.base.setOrigin(0.5, 0.5);
    scene.physics.add.existing(this.base);
    this.base.body.setCircle(radius);

    if (land) {
      this.land = scene.add.sprite(x, y, 'planets');
      this.land.displayWidth = radius * 2;
      this.land.displayHeight = radius * 2;
      this.land.setFrame(land);
      this.land.setOrigin(0.5, 0.5);
    }
    if (atmosphere) {
      this.atmosphere = scene.add.sprite(x, y, 'planets');
      this.atmosphere.displayWidth = radius * 2;
      this.atmosphere.displayHeight = radius * 2;
      this.atmosphere.setFrame(atmosphere);
      this.atmosphere.setOrigin(0.5, 0.5);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('planet', function (x, y) {
  const planet = new Planet(this.scene, x, y);

  this.displayList.add(planet);

  return planet
});
