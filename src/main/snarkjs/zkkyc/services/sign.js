const iden3crypto = require("@iden3/js-crypto");

/**
 * 
 * @param {Uint8Array} privKey 
 * @param {bigint} msgHash 
 * @returns {{ R8: [bigint, bigint], S: bigint }}
 */
function sign(privKey, msgHash) {
    return iden3crypto.eddsa.signPoseidon(privKey, msgHash);
}

module.exports = sign;
