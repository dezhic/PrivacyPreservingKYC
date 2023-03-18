const CryptoJS = require("crypto-js");

/**
 * 
 * @param {string} cipher hex string of the cipher
 * @param {string} iv hex string of the iv
 * @param {string} key hex string of the aes key
 * @returns {Buffer} decrypted buffer
 */
function decrypt(cipher, iv, key) {
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

module.exports = decrypt;
