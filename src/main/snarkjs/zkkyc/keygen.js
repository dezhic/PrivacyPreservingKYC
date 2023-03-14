const createBlakeHash = require('blake-hash');
const iden3crypto = require('@iden3/js-crypto');
const crypto = require('crypto');
const babyjubCodec = require('./babyjub-codec248');

function babyJubKeyGen() {
    // Generate a random private key and its corresponding public key
    const privBuf = crypto.randomBytes(31);
    const priv = new iden3crypto.PrivateKey(privBuf);
    const pub = priv.public();
    // Process private key according to the eddsa spec
    const blaked = createBlakeHash('blake512').update(privBuf).digest()
    const pruned = iden3crypto.eddsa.pruneBuffer(blaked).slice(0, 31);
    let privScalar = iden3crypto.ffUtils.leBuff2int(pruned);
    privScalar = privScalar >> 3n;

    return { priv: priv, pub: pub, privScalar: privScalar };
}

function symmetricKeyGen() {
    let rawKey = crypto.randomBytes(31);
    let rawKeyInt = iden3crypto.ffUtils.leBuff2int(rawKey);
    // Encode the raw key as a babyjub point and its x-coordinate's XOR with the raw key
    let encodedKey = babyjubCodec.encode(rawKeyInt);
    return {
        rawKey: rawKey,
        encodedKey: encodedKey,
    }
}

module.exports = {
    babyJubKeyGen: babyJubKeyGen,
    symmetricKeyGen: symmetricKeyGen,
}
