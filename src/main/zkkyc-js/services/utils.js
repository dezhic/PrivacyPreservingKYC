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
function leDid2Uint248Array(did, n248Bits) {
    const buf = Buffer.alloc(n248Bits * 31);  // n248Bits * 31 bytes
    buf.write(did, 0, n248Bits * 31, "utf8");
    const arr = [];
    for (let i = 0; i < n248Bits; i++) {
        const chunk = buf.slice(i * 31, (i + 1) * 31);
        arr.push(iden3crypto.ffUtils.leBuff2int(chunk));
    }
    return arr;
}

function leUint248Array2Did(arr) {
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

/**
 * Generate a random 253-bit bigint
 * @returns {bigint} a random 253-bit bigint
 */
function randomUint253() {
    let randBuf = crypto.randomBytes(32);
    let randInt = iden3crypto.ffUtils.leBuff2int(randBuf);
    return randInt >> 3n;  // 256-bit -> 253-bit
}

/**
 * ATTENTION! BIZARRE BEHAVIOR!
 * This is for little-endian bytes order
 * but big-endian bits order!!!
 * 
 * Source: circomlib/test/sha256.js
 * @param {array} a an array of bits "0" or "1"
 * @returns {Buffer} a buffer of bytes
 */
function beBitArray2buffer(a) {
    const len = Math.floor((a.length -1 )/8)+1;
    const b = new Buffer.alloc(len);

    for (let i=0; i<a.length; i++) {
        const p = Math.floor(i/8);
        b[p] = b[p] | (Number(a[i]) << ( 7 - (i%8)  ));
    }
    return b;
}

/**
 * ATTENTION! BIZARRE BEHAVIOR!
 * This is for little-endian bytes order
 * but big-endian bits order!!!
 * 
 * Source: circomlib/test/sha256.js
 * @param {Buffer} b 
 * @returns {array} an array of 0s and 1s
 */
function beBuffer2bitArray(b) {
    const res = [];
    for (let i=0; i<b.length; i++) {
        for (let j=0; j<8; j++) {
            res.push((b[i] >> (7-j) &1));
        }
    }
    return res;
}

/**
 * Convert a bigint to an array of 0s and 1s (little endian)
 * @param {bigint} x a bigint
 * @param {array} nBits  an array of 0s and 1s
 * @returns 
 */
function leBigInt2Bits(x, nBits) {
    const bits = [];
    for (let i = 0; i < nBits; i++) {
        bits.push(x & 1n);
        x >>= 1n;
    }
    return bits;
}

/**
 * Convert an array of 0s and 1s to a bigint (little endian)
 * @param {array} bits an array of 0s and 1s
 * @returns {bigint} a bigint
 */
function leBits2BigInt(bits) {
    let x = 0n;
    for (let i = bits.length - 1; i >= 0; i--) {
        x <<= 1n;
        x |= BigInt(bits[i]);
    }
    return x;
}

function uint256ToHex(x) {
    return beBitArray2buffer(leBigInt2Bits(x, 256)).toString('hex');
}

function hexToUint256(x) {
    return leBits2BigInt(beBuffer2bitArray(Buffer.from(x, 'hex')));
}

/**
 * Parse the token buffer decrypted from AES to get {didI, didHI, didHV, didV}
 * @param {Uint8Array} buf token buffer decrypted from AES
 * @param {*} n248Bits number of 248-bit chunks to represent one DID
 * @returns 
 */
function parseTokenBuffer(buf, n248Bits) {
  const didIBuf = buf.subarray(0, buf.length / 4);
  const didHIBuf = buf.subarray(buf.length / 4, buf.length / 2);
  const didHVBuf = buf.subarray(buf.length / 2, buf.length * 3 / 4);
  const didVBuf = buf.subarray(buf.length * 3 / 4, buf.length);
  
  const read256Ints = (buf) => {
    const ints = [];
    for (let i = 0; i < buf.length; i += 32) {
      const chunk = buf.subarray(i, i + 32);
      ints.push(leBits2BigInt(beBuffer2bitArray(chunk)));
    }
    return ints;
  };

  return {
    didI: leUint248Array2Did(read256Ints(didIBuf), n248Bits),
    didHI: leUint248Array2Did(read256Ints(didHIBuf), n248Bits),
    didHV: leUint248Array2Did(read256Ints(didHVBuf), n248Bits),
    didV: leUint248Array2Did(read256Ints(didVBuf), n248Bits),
  }
}

// Finite field F_p, the circuit can only handle numbers smaller than this!
const GLOBAL_FIELD_P = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

module.exports = {
    leDid2Uint248Array: leDid2Uint248Array,
    leUint248Array2Did: leUint248Array2Did,
    hashUint248Array: hashUint248Array,
    beBitArray2buffer: beBitArray2buffer,
    beBuffer2bitArray: beBuffer2bitArray,
    leBigInt2Bits: leBigInt2Bits,
    leBits2BigInt: leBits2BigInt,
    uint256ToHex: uint256ToHex,
    hexToUint256: hexToUint256,
    randomPoint: randomPoint,
    randomUint253: randomUint253,
    parseTokenBuffer: parseTokenBuffer,
    GLOBAL_FIELD_P: GLOBAL_FIELD_P,
}
