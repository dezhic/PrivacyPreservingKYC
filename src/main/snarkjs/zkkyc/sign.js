const iden3crypto = require("@iden3/js-crypto");

/**
 * 
 * @param {Uint8Array} privKey 
 * @param {bigint} msgHash248 
 * @returns { R8: [bigint, bigint], S: bigint }
 */
function sign(privKey, msgHash248) {
    return iden3crypto.eddsa.signPoseidon(privKey, msgHash248);
}

module.exports = sign;
