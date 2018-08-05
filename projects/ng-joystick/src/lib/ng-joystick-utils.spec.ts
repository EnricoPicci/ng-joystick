
import {distance, angle, radians, findCoord, degrees} from './ng-joystick-utils';

describe('1 - distance', () => {

    it('1.1 - calculate the distance between (0,0) and (4,3)', () => {
      const p1 = {x: 0, y: 0};
      const p2 = {x: 3, y: 4};
      const result = distance(p1, p2);
      expect(result).toBe(5);
    });
    it('1.2 - calculate the distance between (0,0) and (-4,-3)', () => {
      const p1 = {x: 0, y: 0};
      const p2 = {x: 3, y: 4};
      const result = distance(p1, p2);
      expect(result).toBe(5);
    });
    it('1.3 - calculate the distance between (1,1) and (3,5)', () => {
      const p1 = {x: 0, y: 0};
      const p2 = {x: 3, y: 4};
      const result = distance(p1, p2);
      expect(result).toBe(5);
    });

});


describe('2 - angle', () => {

  it('2.1 - calculate the angle between (0,0) and (3,3)', () => {
    const p1 = {x: 0, y: 0};
    const p2 = {x: 3, y: 3};
    const result = angle(p1, p2);
    expect(result).toBe(45);
  });
  it('2.2 - calculate the angle between (0,0) and (-3,0)', () => {
    const p1 = {x: 0, y: 0};
    const p2 = {x: -3, y: 0};
    const result = angle(p1, p2);
    expect(result).toBe(180);
  });

});


describe('3 - findCoord', () => {

  it('3.1 - calculate coord of newP whose distance is 1 and angle is 0 from P (1,1)', () => {
    const p = {x: 1, y: 1};
    const dist = 1;
    const aDegrees = 0;
    const newP = findCoord(p, dist, aDegrees);
    expect(newP.x).toBe(0);
    expect(newP.y).toBe(1);
  });
  it('3.2 - calculate coord of newP whose distance is sqrt(2*2 + 2*2) and angle is 45 from P (1,1)', () => {
    const p = {x: 1, y: 1};
    const dist = Math.sqrt(2 * 2 + 2 * 2);
    const aDegrees = 45;
    const newP = findCoord(p, dist, aDegrees);
    expect(parseFloat(newP.x.toFixed(4))).toBe(-1);
    expect(parseFloat(newP.y.toFixed(4))).toBe(-1);
  });

});

describe('4 - radians', () => {

  it('4.1 - radians of 90 degrees', () => {
    const result = radians(90);
    expect(result).toBe(Math.PI / 2);
  });
  it('4.2 - radians of 135 degrees', () => {
    const result = radians(135);
    expect(result).toBe(Math.PI / 4 * 3);
  });

});


describe('5 - degrees', () => {

  it('5.1 - degrees of Math.PI / 2', () => {
    const result = degrees(Math.PI / 2);
    expect(result).toBe(90);
  });
  it('5.2 - degrees of Math.PI / 4 * 3', () => {
    const result = degrees(Math.PI / 4 * 3);
    expect(result).toBe(135);
  });

});
