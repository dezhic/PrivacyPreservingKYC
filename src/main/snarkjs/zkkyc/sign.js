const iden3crypto = require("@iden3/js-crypto");

/**
 * 
 * @param {Uint8Array} privKey 
 * @param {bigint} msgHash256 
 * @returns { R8: [bigint, bigint], S: bigint }
 */
function sign(privKey, msgHash256) {
    return iden3crypto.eddsa.signPoseidon(privKey, msgHash256);
}

module.exports = sign;
