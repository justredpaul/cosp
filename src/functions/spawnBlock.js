import Phaser from 'phaser';

import { spawnAsteroids } from './spawnAsteroids';
import { spawnPlanet } from './spawnPlanet';

const BLOCK_WIDTH = 8000;
const BLOCK_HEIGHT = 8000;

const getNextBlock = (currentBlock, direction) => {
  const { top, left } = currentBlock || {
    top: 0,
    left: 0,
  };
  let nextBlock = {
    width: BLOCK_WIDTH,
    height: BLOCK_HEIGHT,
  };

  switch (direction) {
    case 'top':
      nextBlock.top = top - BLOCK_HEIGHT;
      nextBlock.left = left;
      break;
    case 'top_left':
      nextBlock.top = top - BLOCK_HEIGHT;
      nextBlock.left = left - BLOCK_HEIGHT;
      break;
    case 'top_right':
      nextBlock.top = top - BLOCK_HEIGHT;
      nextBlock.left = left + BLOCK_WIDTH;
      break;
    case 'bottom':
      nextBlock.top = top + BLOCK_HEIGHT;
      nextBlock.left = left;
      break;
    case 'bottom_left':
      nextBlock.top = top + BLOCK_HEIGHT;
      nextBlock.left = left - BLOCK_HEIGHT;
      break;
    case 'bottom_right':
      nextBlock.top = top + BLOCK_HEIGHT;
      nextBlock.left = left + BLOCK_WIDTH;
      break;
    case 'left':
      nextBlock.top = top;
      nextBlock.left = left - BLOCK_WIDTH;
      break;
    case 'right':
      nextBlock.top = top;
      nextBlock.left = left + BLOCK_WIDTH;
      break;
    default:
      nextBlock.top = top;
      nextBlock.left = left;
  }

  return nextBlock;
};

/**
 * Spawn asteroids and planets on block
 */
export const spawnBlock = (scene, currentBlock, direction) => {
  const nextBlock = getNextBlock(currentBlock, direction);

  if (scene.existedBlocks.has(`${nextBlock.top}_${nextBlock.left}`)) return;

  const asteroidCount = Phaser.Math.Between(5, 20);

  return {
    block: nextBlock,
    asteroids: spawnAsteroids(scene, nextBlock, asteroidCount),
    planet: spawnPlanet(scene, nextBlock),
  }
};

export const spawnStartBlock = (scene) => {
  const nextBlock = getNextBlock({
    top: -1 * BLOCK_HEIGHT / 2,
    left: -1 * BLOCK_WIDTH / 2,
  });

  const asteroidCount = Phaser.Math.Between(0, 10);

  return {
    block: nextBlock,
    asteroids: spawnAsteroids(scene, nextBlock, asteroidCount),
  }
};

const createBlock = (scene, startBlock, direction) => {
  const newBlock = spawnBlock(scene, startBlock, direction);

  if (!newBlock) return;

  const { block, asteroids } = newBlock;

  scene.existedBlocks.set(`${block.top}_${block.left}`, {
    block,
    asteroids,
  });

  const blockBody = new Phaser.GameObjects.Rectangle(scene, block.left, block.top, BLOCK_WIDTH, BLOCK_HEIGHT);
  blockBody.setOrigin(0, 0);
  scene.physics.add.existing(blockBody);
  scene.physics.add.overlap(scene.probe.spacecraft, blockBody, () => {
    spawnFromCenterBlock(scene, newBlock);
    scene.probe.onEnterBlock(newBlock);
  });
};

export const spawnStartBlocks = (scene) => {
  scene.existedBlocks = new Map();

  const startBlock = spawnStartBlock(scene);
  scene.existedBlocks.set(`${startBlock.block.top}_${startBlock.block.left}`, startBlock);
  scene.currentBlock = startBlock;

  createBlock(scene, startBlock.block, 'top_left');
  createBlock(scene, startBlock.block, 'top');
  createBlock(scene, startBlock.block, 'top_right');
  createBlock(scene, startBlock.block, 'left');
  createBlock(scene, startBlock.block, 'right');
  createBlock(scene, startBlock.block, 'bottom_left');
  createBlock(scene, startBlock.block, 'bottom');
  createBlock(scene, startBlock.block, 'bottom_right');
};

export const spawnFromCenterBlock = (scene, block) => {
  scene.currentBlock = block;

  createBlock(scene, block.block, 'top_left');
  createBlock(scene, block.block, 'top');
  createBlock(scene, block.block, 'top_right');
  createBlock(scene, block.block, 'left');
  createBlock(scene, block.block, 'right');
  createBlock(scene, block.block, 'bottom_left');
  createBlock(scene, block.block, 'bottom');
  createBlock(scene, block.block, 'bottom_right');
};
