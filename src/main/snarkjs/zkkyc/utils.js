const iden3crypto = require('@iden3/js-crypto');
const crypto = require('crypto');

/**
 * 
 * - __DID encoding__:
 *   A DID is encoded into chunks of __bytes__ of length (n248Bits * 31)
 *   Then convert each 31-byte chunk into a 248-bit bigint (little endian)
 * 
 * @param {string} did a DID string
 * @param {number} n248Bits the number of 248-bit chunks to represent the DID
 * @returns {bigint[]} an array of 248-bit bigints
 */
function did2Uint248Array(did, n248Bits) {
    const buf = Buffer.alloc(n248Bits * 31);  // n248Bits * 31 bytes
    buf.write(did, 0, n248Bits * 31, "utf8");
    const arr = [];
    for (let i = 0; i < n248Bits; i++) {
        const chunk = buf.slice(i * 31, (i + 1) * 31);
        arr.push(iden3crypto.ffUtils.leBuff2int(chunk));
    }
    return arr;
}

function uint248Array2Did(arr) {
    const buf = Buffer.alloc(arr.length * 31);
    for (let i = 0; i < arr.length; i++) {
        const chunk = iden3crypto.ffUtils.leInt2Buff(arr[i], 31);
        Buffer.from(chunk).copy(buf, i * 31);
    }
    return buf.toString('utf8').replace(/\0/g, '');
}

/**
 * Create a poseidon hash of an array of 248-bit bigints
 * 
 * @param {bigint[]} arr an array of 248-bit bigints
 * @returns {bigint} poseidon hash of the array of 248-bit bigints
 */
function hashUint248Array(arr) {
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
    did2Uint248Array: did2Uint248Array,
    uint248Array2Did: uint248Array2Did,
    hashUint248Array: hashUint248Array,
    randomPoint: randomPoint,
}
