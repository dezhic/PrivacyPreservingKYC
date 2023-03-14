const test = require('node:test');
const { babyJubKeyGen, symmetricKeyGen } = require('../keygen');

test('generate babyJub key pair', t => {
    const babyJubKeys = babyJubKeyGen();
    console.log(babyJubKeys)
});

test('generate symmetric key (raw and encoded)', t => {
    const symmetricKeys = symmetricKeyGen();
    console.log(symmetricKeys);
});
