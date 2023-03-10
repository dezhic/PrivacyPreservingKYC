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
 * 
 * @param {string} didI  public DID of the issuer
 * @param {string} didHI peer DID of the holder for the issuer
 * @param {number} byteLength byte length of one DID
 * @returns {Uint8Array} the credential buffer containing concatenated bits of the two DIDs
 */
function dids2credBuf(didI, didHI, byteLength) {
    const buf = Buffer.alloc(byteLength * 2);
    buf.write(didI, 0, byteLength, "utf8");
    buf.write(didHI, byteLength, byteLength * 2, "utf8");
    return buf;
}

/**
 * 
 * @param {Uint8Array} credBuf 
 * @returns {bigint} sha256 hash of the credential buffer, represented as a little endian bigint
 */
function hashCredBuf(credBuf) {
    const hashBuf = crypto.createHash("sha256").update(credBuf).digest();
    return iden3crypto.ffUtils.leBuff2int(hashBuf);
}

module.exports = {
    sign: sign,
    dids2credBuf: dids2credBuf,
    hashCredBuf: hashCredBuf
};
