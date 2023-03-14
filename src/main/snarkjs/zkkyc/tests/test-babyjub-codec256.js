const test = require('node:test');
const assert = require('node:assert/strict');
const { encode, decode } = require('../babyjub-codec248.js');

const message248 = 0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcden;
var point, xmXor;

test('encode a message to a point and xor value of the message and point.x', (t) => {
    const result = encode(message248);
    point = result.point;
    xmXor = result.xmXor;
    assert.strictEqual(point[0] ^ xmXor, message248);
    console.log("point", point);
    console.log("xmXor", xmXor);
});

test('decode a point and xor value to a message', (t) => {
    const message = decode(point, xmXor);
    assert.strictEqual(message, message248);
});
