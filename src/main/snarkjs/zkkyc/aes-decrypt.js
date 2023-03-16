const CryptoJS = require("crypto-js");
const { buffer2bitArray, bits2BigInt, uint248Array2Did } = require('./utils');


function decrypt(cipher, key, iv) {
  const cipherWords = CryptoJS.enc.Hex.parse(cipher);
  const keyWords = CryptoJS.enc.Hex.parse(key);
  const ivWords = CryptoJS.enc.Hex.parse(iv);

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: cipherWords },
    keyWords,
    { iv: ivWords, mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.NoPadding }
  );

  const decryptedBuf = Buffer.from(decrypted.toString(CryptoJS.enc.Hex), 'hex');

  return decryptedBuf;
}

function parseTokenBuffer(buf, n248Bits) {
  const didIBuf = buf.subarray(0, buf.length / 4);
  const didHIBuf = buf.subarray(buf.length / 4, buf.length / 2);
  const didHVBuf = buf.subarray(buf.length / 2, buf.length * 3 / 4);
  const didVBuf = buf.subarray(buf.length * 3 / 4, buf.length);
  
  const read256Ints = (buf) => {
    const ints = [];
    for (let i = 0; i < buf.length; i += 32) {
      const chunk = buf.subarray(i, i + 32);
      ints.push(bits2BigInt(buffer2bitArray(chunk)));
    }
    return ints;
  };

  return {
    didI: uint248Array2Did(read256Ints(didIBuf), n248Bits),
    didHI: uint248Array2Did(read256Ints(didHIBuf), n248Bits),
    didHV: uint248Array2Did(read256Ints(didHVBuf), n248Bits),
    didV: uint248Array2Did(read256Ints(didVBuf), n248Bits),
  }
}

const symKeyHex = '494485226912f91c6c5b20e4c43ecd964b8341d59d01f13105cf6a92dc1c1e00';
const cipherHex = 'bc0442bc5419c22378cab6e3b7410e2c2a1eff962259288ff3616d1dda381649f5bc94785000873cc9b2c9b4383e41c39ca42369a615e2c67ad7c15a17286b1e248d215d0af41804e8faf9af4d94d6ca5b4a628a9ca4e791863f65a86e8a19f717fc471c806c8322a8f7a9fad647bb4c87eb172c91f4bc5bb05b4ed3abeb5b75';
const iv = 'b3aba32323a3a3a30000000000000000';

console.log(parseTokenBuffer(decrypt(cipherHex, symKeyHex, iv), 1));
