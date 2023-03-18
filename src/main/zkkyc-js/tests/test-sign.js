const test = require("node:test");
const { leDid2Uint248Array, hashUint248Array } = require('../services/utils');
const { babyJubKeyGen } = require('../services/keygen');
const sign = require('../services/sign');

let babyJubKeys;
test('generate babyJub key pair', t => {
  babyJubKeys = babyJubKeyGen();
  console.log('priv:', babyJubKeys.priv);
  console.log('pub:', babyJubKeys.pub);
});

const didI = 'did:sov:issuer0001';
const didHI = 'did:peer:holder01forissuer00001';
let didIArray, didHIArray;
test('generate the bigint array representation of a DID', t => {
  didIArray = leDid2Uint248Array(didI, 1);
  didHIArray = leDid2Uint248Array(didHI, 1);
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
  const sig = sign(babyJubKeys.priv.sk, hash);
  console.log('sig', sig);
});
