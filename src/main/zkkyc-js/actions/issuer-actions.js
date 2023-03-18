const keygen = require('../services/keygen');
const { leDid2Uint248Array, hashUint248Array, uint256ToHex } = require('../services/utils');
const sign = require('../services/sign');

module.exports = {
    
    /**
     * 
     * @param {string} didI Issuer's public DID (max 31 bytes)
     * @param {string} didHI Holder's registered peer DID (max 31 bytes)
     * @param {string} privKey hex string of the private key of the issuer
     */
    signDidRecord: (didI, didHI, privKey) => {
        if (!privKey) {
            throw new Error('Missing private key');
        }

        const keys = keygen.babyJubKeyGen(privKey);

        const didIArray = leDid2Uint248Array(didI, 1);
        const didHIArray = leDid2Uint248Array(didHI, 1);
        
        const hash = hashUint248Array(didIArray.concat(didHIArray));
        const sig = sign(keys.priv.sk, hash);

        return {
            S: uint256ToHex(sig.S),
            R: sig.R8.map(uint256ToHex),
        }
    },

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

}
