// 0   -> -210
// 500 -> 40

export const getDegreesFromSpeed = (speed, maxSpeed) => {
  return 250 * (speed / maxSpeed) - 210;
};
