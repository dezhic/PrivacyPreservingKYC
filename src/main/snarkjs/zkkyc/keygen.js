const createBlakeHash = require('blake-hash');
const iden3crypto = require('@iden3/js-crypto');
const crypto = require('crypto');
const babyjubCodec = require('./babyjub-codec253');

function babyJubKeyGen() {
    // Generate a random private key and its corresponding public key
    const privBuf = crypto.randomBytes(32);
    const priv = new iden3crypto.PrivateKey(privBuf);
    const pub = priv.public();
    // Process private key according to the eddsa spec
    const blaked = createBlakeHash('blake512').update(privBuf).digest()
    const pruned = iden3crypto.eddsa.pruneBuffer(blaked).slice(0, 32);
    let privScalar = iden3crypto.ffUtils.leBuff2int(pruned);
    privScalar = privScalar >> 3n;

    return { priv: priv, pub: pub, privScalar: privScalar };
}

function symmetricKeyGen() {
    let randBuf = crypto.randomBytes(32);
    let randInt = iden3crypto.ffUtils.leBuff2int(randBuf);
    // This makes the key stay within the babyjub curve's order p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
    let rawKey = randInt >> 3n;
    // Encode the raw key as a babyjub point and its x-coordinate's XOR with the raw key
    let encodedKey = babyjubCodec.encode(rawKey);
    return {
        rawKey: rawKey,
        encodedKey: encodedKey,
    }
}

module.exports = {
    babyJubKeyGen: babyJubKeyGen,
    symmetricKeyGen: symmetricKeyGen,
}
