const keygen = require('../services/keygen');
const { uint256ToHex, leBigInt2Bits, beBitArray2buffer, parseTokenBuffer } = require('../services/utils');
const babyjubDecrypt = require('../services/babyjub-decrypt');
const babyjubCodec = require('../services/babyjub-codec253');
const aesDecrypt = require('../services/aes-decrypt');

module.exports = {

    /**
     * Generate babyjub public key and private key given a 32-byte hex string, or generate a new random key pair
     * 
     * @param {string | undefined} privKey hex string of a 32-byte buffer for generating a babyjub key pair, or undefined to generate a new random key
     * @returns 
     */
    generateKeyPair: (privKey) => {
        const keys = keygen.babyJubKeyGen(privKey);
        return {
            priv: Buffer.from(keys.priv.sk).toString('hex'),
            pub: keys.pub.p.map(uint256ToHex),
        }
    },

    /**
     * 
     * @param {object} parsedPublic parsed public input/output object
     * @param {string} privKey hex string of government's private key
     */
    decryptToken: (parsedPublic, privKey) => {
        // Decrypt the the AES key using ElGamal with babyjub curve
        privKey = Buffer.from(privKey, 'hex');
        const aesKeyPoint = babyjubDecrypt(
            {
                c1: parsedPublic.aesKeyPointCipher.c1.map(BigInt),
                c2: parsedPublic.aesKeyPointCipher.c2.map(BigInt),
            },
            privKey);
        const aesKey = babyjubCodec.decode(aesKeyPoint, BigInt(parsedPublic.aesKeyXmXor));

        // Decrypt the token with the AES key using AES-256-CTR
        const aesKeyBuf = beBitArray2buffer(leBigInt2Bits(aesKey, 256));
        const tokenBuf = aesDecrypt(
            parsedPublic.encryptedPayload.substr(0, 256),
            parsedPublic.encryptedPayload.substr(256, 32),
            aesKeyBuf.toString('hex')
        );

        return parseTokenBuffer(tokenBuf, 1);
    }

}
