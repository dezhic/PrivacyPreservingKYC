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

const aesKeyHex = '6264a4d0f6b61bfd071b54c1fa788279fe4d2192fbd430f668897e43507a0c20';
const cipherHex = '6c6ea195f2544ca3e904adc3d51997a1b8ebe4bc2c0c8641f83ddb31801d3b25105420767f15617851b4e81b71f3c37e1cd00a9a008acabf6b2ed4c6674635b2a554714ebd1b639dc8aaf4e748f3521ca092b82cf43105fc9dd25b0cd8506934343f7051878c8b5aab44d1cc17cb4e6773bc3dcecfc43b783d262d7c092471b2';
const iv = '28b7ab22aaa30bb70000000000000000';

console.log(parseTokenBuffer(decrypt(cipherHex, aesKeyHex, iv), 1));
