const test = require('node:test');
const { babyJubKeyGen, aesKeyGen } = require('../services/keygen');

test('generate babyJub key pair', t => {
    const babyJubKeys = babyJubKeyGen();
    console.log(babyJubKeys)
});

test('generate symmetric key (raw and encoded)', t => {
    const aesKeys = aesKeyGen();
    console.log(aesKeys);
});
