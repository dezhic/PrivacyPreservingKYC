const iden3crypto = require('@iden3/js-crypto');
const crypto = require('crypto');

/**
 * 
 * - __DID encoding__:
 *   A DID is encoded into chunks of __bytes__ of length (n256Bits * 32)
 *   Then convert each 32-byte chunk into a 256-bit bigint (little endian)
 * 
 * @param {string} did a DID string
 * @param {number} n256Bits the number of 256-bit chunks to represent the DID
 * @returns {bigint[]} an array of 256-bit bigints
 */
function did2Uint256Array(did, n256Bits) {
    const buf = Buffer.alloc(n256Bits * 32);  // n256Bits * 32 bytes
    buf.write(did, 0, n256Bits * 32, "utf8");
    const arr = [];
    for (let i = 0; i < n256Bits; i++) {
        const chunk = buf.slice(i * 32, (i + 1) * 32);
        arr.push(iden3crypto.ffUtils.leBuff2int(chunk));
    }
    return arr;
}

function uint256Array2Did(arr) {
    const buf = Buffer.alloc(arr.length * 32);
    for (let i = 0; i < arr.length; i++) {
        const chunk = iden3crypto.ffUtils.leInt2Buff(arr[i], 32+1); // +1 for the sign bit (always 0 as we are using unsigned integers)
        Buffer.from(chunk).copy(buf, i * 32);
    }
    return buf.toString('utf8').replace(/\0/g, '');
}

/**
 * Create a poseidon hash of an array of 256-bit bigints
 * 
 * @param {bigint[]} arr an array of 256-bit bigints
 * @returns {bigint} poseidon hash of the array of 256-bit bigints
 */
function hashUint256Array(arr) {
    return iden3crypto.poseidon.hash(arr);
}

/**
 * Generate a random point on the babyjub curve
 * @returns a random point on the babyjub curve
 */
function randomPoint() {
    const privBuf = crypto.randomBytes(32);
    const priv = new iden3crypto.PrivateKey(privBuf);
    return priv.public().p;
}

const GLOBAL_FIELD_P = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

module.exports = {
    did2Uint256Array: did2Uint256Array,
    uint256Array2Did: uint256Array2Did,
    hashUint256Array: hashUint256Array,
    randomPoint: randomPoint,
}
