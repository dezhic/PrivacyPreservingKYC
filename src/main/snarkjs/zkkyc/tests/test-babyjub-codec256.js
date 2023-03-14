const test = require('node:test');
const assert = require('node:assert/strict');
const { encode, decode } = require('../babyjub-codec256.js');

const message256 = 0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0n;
var point, xmXor;

test('encode a message to a point and xor value of the message and point.x', (t) => {
    const result = encode(message256);
    point = result.point;
    xmXor = result.xmXor;
    assert.strictEqual(point[0] ^ xmXor, message256);
    console.log("point", point);
    console.log("xmXor", xmXor);
});

test('decode a point and xor value to a message', (t) => {
    const message = decode(point, xmXor);
    assert.strictEqual(message, message256);
});
