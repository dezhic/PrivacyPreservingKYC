const crypto = require("crypto");
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

/**
 * This function converts two DIDs into a credential buffer
 * - __DID encoding__:
 *   A DID is encoded into chunks of __bytes__ of length (n256Bits * 32)
 *   Then convert each 32-byte chunk into a 256-bit bigint (little endian)
 *   Finally, represent a DID as an array of 256-bit bigints
 * - __credBuf encoding__:
 *   credBuf = [didI, didHI], a concatenation of the two DID bigint arrays
 * 
 * @param {string} didI  public DID of the issuer
 * @param {string} didHI peer DID of the holder for the issuer
 * @param {number} n256Bits the number of 256-bit chunks to represent one DID
 * @returns {bigint[]} an array of 256-bit bigints
 */
function dids2credArr(didI, didHI, n256Bits) {
    const buf = Buffer.alloc(2 * n256Bits * 32);
    buf.write(didI, 0, n256Bits * 32, "utf8");
    buf.write(didHI, n256Bits * 32, n256Bits * 32, "utf8");
    const arr = [];
    for (let i = 0; i < 2 * n256Bits; i++) {
        const chunk = buf.slice(i * 32, (i + 1) * 32);
        arr.push(iden3crypto.ffUtils.leBuff2int(chunk));
    }
    return arr;
}

/**
 * 
 * @param {bigint[]} credArr 
 * @returns {bigint} poseidon hash of the credential represented in an array of little-endian bigint
 */
function hashCredArr(credArr) {
    return iden3crypto.poseidon.hash(credArr);
}

module.exports = {
    sign: sign,
    dids2credArr: dids2credArr,
    hashCredArr: hashCredArr
};
