const keygen = require('../services/keygen');
module.exports = {
    /**
     * Generate babyjub public key and private key
     * @param {string} hex 32-byte hex string
     * @returns {object}
     */
    generateKeyPair: (hex) => {
        
        return keygen.generateKeyPair(hex);
    }
}
