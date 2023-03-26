const iden3crypto = require('@iden3/js-crypto');
const createBlakeHash = require('blake-hash');

/**
 * 
 * @param {Uint8Array} privKey
 * @param {{c1: [BigInt, BigInt], c2: [BigInt, BigInt]}} cipher 
 * @return {{x: BigInt, y: BigInt}} decrypted message
 */
function decrypt(cipher, privKey) {
    // Process private key according to the eddsa spec
    const blaked = createBlakeHash('blake512').update(privKey).digest()
    const pruned = iden3crypto.eddsa.pruneBuffer(blaked).slice(0, 32);
    let privScalar = iden3crypto.ffUtils.leBuff2int(pruned);
    privScalar = privScalar >> 3n;

    const babyJub = iden3crypto.babyJub;
    // Compute shared secret s
    var s = babyJub.mulPointEscalar(cipher.c1, privScalar);
    // Compute the inverse of s
    var sInvX = babyJub.F.e(-1n * s[0]);
    var sInvY = s[1];
    var mPoint = babyJub.addPoint(cipher.c2, [sInvX, sInvY]);
    return mPoint;
}

module.exports = decrypt;
