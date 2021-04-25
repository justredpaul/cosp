import Phaser from 'phaser';
import { DRONE_RADIUS } from '../objects/probe';

export const getClosestAsteroid = (scene, ignoreMining = true) => {
  const { asteroids } = scene.currentBlock;
  const asteroidsBodies = [];
  asteroids.getChildren().forEach(({ body }) => {
    if (ignoreMining && scene.probe.miningList.has(body)) return;
    asteroidsBodies.push(body)
  });

  const closest = scene.physics.closest(scene.probe.spacecraft.body, asteroidsBodies);

  if (!closest || scene.probe.miningList.has(closest.asteroidBody)) return null;

  const distance = Phaser.Math.Distance.Between(closest.x, closest.y, scene.probe.spacecraft.body.x, scene.probe.spacecraft.body.y);

  if (distance > DRONE_RADIUS) return;

  return {
    distance,
    asteroidBody: closest,
  };
};
