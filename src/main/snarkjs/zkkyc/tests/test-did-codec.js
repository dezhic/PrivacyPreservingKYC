const test = require('node:test');
const assert = require('node:assert/strict');
const utils = require('../utils');

const didI = 'did:sov:issuer0001';
const didHI = 'did:peer:holder01forissuer0001';
const didHV = 'did:peer:holder01forverifier0001';
const didV = 'did:sov:verifier0001';

test('encode didI', t => {
    const arr = utils.did2Uint256Array(didI, 1);
    console.log(arr);
    const decoded = utils.uint256Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(didI, decoded);
});

test('encode didHI', t => {
    const arr = utils.did2Uint256Array(didHI, 1);
    console.log(arr);
    const decoded = utils.uint256Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(didHI, decoded);
});

test('encode didHV', t => {
    const arr = utils.did2Uint256Array(didHV, 1);
    console.log(arr);
    const decoded = utils.uint256Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(didHV, decoded);
});

test('encode didV', t => {
    const arr = utils.did2Uint256Array(didV, 1);
    console.log(arr);
    const decoded = utils.uint256Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(didV, decoded);
});

const did64Bytes = 'did:sov:0123456789abcdefghijklmnopqrstuvwxyz';
test('encode did of 2 * 256 bits', t => {
    const arr = utils.did2Uint256Array(did64Bytes, 2);
    console.log(arr);
    const decoded = utils.uint256Array2Did(arr);
    console.log(decoded);
    assert.strictEqual(did64Bytes, decoded);
});
