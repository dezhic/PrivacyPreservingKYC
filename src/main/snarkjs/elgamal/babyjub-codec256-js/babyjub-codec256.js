const crypto = require("crypto");
const iden3crypto = require("@iden3/js-crypto");


/**
 * 
 * @param {bigint} message an arbitrary 256-bit bigint
 * @returns {point: [bigint, bigint], xmXor: bigint} point: the encoded babyjub point, xmXor: the xor of the message bytes and the x-coordinate of the point
 */
function encode(message) {
    const point = randomPoint();
    const xmXor = point[0] ^ message;
    return { point: point, xmXor: xmXor };
}

/**
 * 
 * @param {[bigint, bigint]} point 
 * @param {bigint} xmXor 
 * @returns {bigint} the decoded message
 */
function decode(point, xmXor) {
    return point[0] ^ xmXor;
}

function randomPoint() {
    const privBuf = crypto.randomBytes(32);
    const priv = new iden3crypto.PrivateKey(privBuf);
    return priv.public().p;
}

module.exports = {
    encode: encode,
    decode: decode,
    randomPoint: randomPoint
};
