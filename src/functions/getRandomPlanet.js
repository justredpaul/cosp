import Phaser from 'phaser';

// Sprites indexes
const PLANET_BASES = [0, 1, 2];
const PLANET_LANDS = [3, 4, 5];
const PLANET_ISLANDS = [6, 7, 8];
const PLANET_ATMOSPHERE = [9, 10];

export const getRandomPlanet = () => {
  const base = Phaser.Math.RND.pick(PLANET_BASES);
  let land;
  let atmosphere;
  let life = false;

  // Should planet have a land or islands
  if (Phaser.Math.Between(0, 1)) {
    land = Phaser.Math.RND.pick(PLANET_LANDS);
  } else if (Phaser.Math.Between(0, 1)) {
    land = Phaser.Math.RND.pick(PLANET_ISLANDS);
  }

  // Should planet have an atmosphere
  if (Phaser.Math.Between(0, 1)) {
    atmosphere = Phaser.Math.RND.pick(PLANET_ATMOSPHERE);
  }

  // Should planet have a life on it
  if (land && atmosphere) {
    life = !!Phaser.Math.Between(0, 1);
  }

  return {
    base,
    land,
    atmosphere,
    life,
  }
};
