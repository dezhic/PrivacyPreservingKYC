const test = require("node:test");
const { did2Uint248Array, hashUint248Array } = require('../utils');
const { babyJubKeyGen } = require('../keygen');
const sign = require('../sign');

let babyJubKeys;
test('generate babyJub key pair', t => {
  babyJubKeys = babyJubKeyGen();
  console.log('priv:', babyJubKeys.priv);
  console.log('pub:', babyJubKeys.pub);
  console.log('privScalar:', babyJubKeys.privScalar);
});

const didI = 'did:sov:123456789abcdefghi';
const didHI = 'did:peer:abcdefghijklmnopqrstuv';
let didIArray, didHIArray;
test('generate the bigint array representation of a DID', t => {
  didIArray = did2Uint248Array(didI, 1);
  didHIArray = did2Uint248Array(didHI, 1);
  console.log('didIArray:', didIArray);
  console.log('didHIArray:', didHIArray);
});

let concatArray = [];
test('concatenate didIArray and didHIArray', t => {
  concatArray = concatArray.concat(didIArray, didHIArray);
  console.log('concatArray:', concatArray);
});

let hash;
test('hash the concatenated array', t => {
  hash = hashUint248Array(concatArray);
  console.log('hash:', hash);
});

test('sign the hash', t => {
  const sig = sign(babyJubKeys.priv, hash);
  console.log('sig', sig);
});
