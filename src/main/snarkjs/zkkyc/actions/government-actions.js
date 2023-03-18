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
            privScalar: uint256ToHex(keys.privScalar),
        }
    },

    decryptToken: (token, privKey) => {

    }

}
