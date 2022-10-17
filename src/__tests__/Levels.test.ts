import json from '../../public/onelvl.json'
import { DefaultLevel } from '../engine/Levels/Defaultlevel';

test('adds 1 + 2 to equal 3', () => {

  const level = new DefaultLevel(json as any, {});
  console.log(level);
  expect(3).toBe(3);
});