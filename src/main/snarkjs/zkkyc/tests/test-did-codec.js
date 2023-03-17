const test = require('node:test');
const assert = require('node:assert/strict');
const utils = require('../services/utils');

const didI = 'did:sov:issuer0001';
const didHI = 'did:peer:holder01forissuer001';
const didHV = 'did:peer:holder01forverifier001';
const didV = 'did:sov:verifier0001';

test('encode didI', t => {
    const arr = utils.leDid2Uint248Array(didI, 1);
    console.log(arr);
    const decoded = utils.leUint248Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(didI, decoded);
});

test('encode didHI', t => {
    const arr = utils.leDid2Uint248Array(didHI, 1);
    console.log(arr);
    const decoded = utils.leUint248Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(didHI, decoded);
});

test('encode didHV', t => {
    const arr = utils.leDid2Uint248Array(didHV, 1);
    console.log(arr);
    const decoded = utils.leUint248Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(didHV, decoded);
});

test('encode didV', t => {
    const arr = utils.leDid2Uint248Array(didV, 1);
    console.log(arr);
    const decoded = utils.leUint248Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(didV, decoded);
});

const did62Bytes = '0123456789abdef0123456789abdef0123456789abdef0123456789abdef01';
test('encode did of 2 * 248 bits (62 bytes)', t => {
    const arr = utils.leDid2Uint248Array(did62Bytes, 2);
    console.log(arr);
    const decoded = utils.leUint248Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(did62Bytes, decoded);
});
