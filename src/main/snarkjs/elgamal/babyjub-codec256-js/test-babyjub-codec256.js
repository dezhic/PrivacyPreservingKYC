const test = require('node:test');

test('print random point generated by the codec function', (t) => {
    const { randomPoint } = require('./babyjub-codec256.js');
    const point = randomPoint();
    console.log("Random point on babyjubjub curve, please manually verify that it is on the curve: ");
    console.log(point);
});
