import Phaser from 'phaser';

import { Planet } from '../objects/planet';

const MIN_PLANET_RADIUS = 300;
const MAX_PLANET_RADIUS = 1500;
const PLANET_SPAWN_OFFSET = 2000;

export const spawnPlanet = (scene, block) => {
  const hasPlanet = Phaser.Math.Between(0, 1);

  if (!hasPlanet) return null;

  const radius = Phaser.Math.Between(MIN_PLANET_RADIUS, MAX_PLANET_RADIUS);
  const x = block.left + Phaser.Math.RND.between(PLANET_SPAWN_OFFSET + radius, block.width - PLANET_SPAWN_OFFSET - radius);
  const y = block.top + Phaser.Math.RND.between(PLANET_SPAWN_OFFSET + radius, block.height - PLANET_SPAWN_OFFSET - radius);
  return new Planet(scene, x, y, radius);
};
