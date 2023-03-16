const iden3crypto = require('@iden3/js-crypto');

/**
 * 
 * @param {BigInt} privKeyScalar
 * @param {{c1: [BigInt, BigInt], c2: [BigInt, BigInt]}} cipher 
 */
function decrypt(cipher, privKeyScalar) {
    const babyJub = iden3crypto.babyJub;
    // Compute shared secret s
    var s = babyJub.mulPointEscalar(cipher.c1, privKeyScalar);
    // Compute the invert
    var sInvX = babyJub.F.e(-1n * s[0]);
    var sInvY = s[1];
    var mPoint = babyJub.addPoint(cipher.c2, [sInvX, sInvY]);
    return mPoint;
}

module.exports = decrypt;
