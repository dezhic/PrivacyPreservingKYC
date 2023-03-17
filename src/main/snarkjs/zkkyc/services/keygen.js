const createBlakeHash = require('blake-hash');
const iden3crypto = require('@iden3/js-crypto');
const crypto = require('crypto');
const babyjubCodec = require('./babyjub-codec253');
const { leBigInt2Bits, beBitArray2buffer } = require('./utils');

/**
 * Generate BabyJub private and public keys
 * @param { Uint8Array | string | undefined } privBuf a 32-byte private key buffer or a hex string, or undefined to generate a random key
 * @returns 
 */
function babyJubKeyGen(privBuf) {
    // Generate a random private key and its corresponding public key
    if (!privBuf) {
        privBuf = crypto.randomBytes(32);
    } else {
        if (privBuf instanceof string) {
            privBuf = Buffer.from(privBuf, 'hex');
        }
    }
    const priv = new iden3crypto.PrivateKey(privBuf);
    const pub = priv.public();
    // Process private key according to the eddsa spec
    const blaked = createBlakeHash('blake512').update(privBuf).digest()
    const pruned = iden3crypto.eddsa.pruneBuffer(blaked).slice(0, 32);
    let privScalar = iden3crypto.ffUtils.leBuff2int(pruned);
    privScalar = privScalar >> 3n;

    return { priv: priv, pub: pub, privScalar: privScalar };
}

function aesKeyGen() {
    let randBuf = crypto.randomBytes(32);
    let randInt = iden3crypto.ffUtils.leBuff2int(randBuf);
    // This makes the key stay within the babyjub curve's order p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
    let rawKey = randInt >> 3n;  // 253-bit key
    // Encode the raw key as a babyjub point and its x-coordinate's XOR with the raw key
    let encodedKey = babyjubCodec.encode(rawKey);
    return {
        rawKey: rawKey,
        encodedKey: encodedKey,
    }
}

module.exports = {
    babyJubKeyGen: babyJubKeyGen,
    aesKeyGen: aesKeyGen,
}
