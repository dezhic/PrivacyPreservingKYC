const { randomPoint } = require('./utils');

/**
 * Encode an arbitrary 253-bit bigint (little endian) into a babyjub point and a scalar
 * We cannot do this for an arbitrary 254-bit bigint because it must be less 
 * than the order of the curve, which is a 254-bit prime number (p = 21888242871839275222246405745257275088548364400416034343698204186575808495617)
 * 
 * The scalar `xmXor` is the xor of the message bytes and the lowest 253 bits of the x-coordinate of the point
 * 
 * @param {bigint} message an arbitrary 253-bit bigint (little endian)
 * @returns {{point: [bigint, bigint], xmXor: bigint}} point: the encoded babyjub point, xmXor: the xor of the message bytes and the x-coordinate of the point
 */
function encode(message) {
    const point = randomPoint();
    const xmXor = message ^ (point[0] & 0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn);  // message XOR lowest 253 bits of x-coordinate
    return { point: point, xmXor: xmXor };
}

/**
 * 
 * @param {[bigint, bigint]} point 
 * @param {bigint} xmXor 
 * @returns {bigint} the decoded message
 */
function decode(point, xmXor) {
    return xmXor ^ (point[0] & 0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn);
}

module.exports = {
    encode: encode,
    decode: decode,
};
