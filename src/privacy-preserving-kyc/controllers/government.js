const decrypt = require('../utils/decrypt-zkkyc-token.js');
module.exports = {
    index: async function (req, res) {
        res.render('government/index', {})
    },

    decryptToken: async function (req, res) {
        try {
            const decrypted = await decrypt(req.body.parsed_token, req.body.priv_key);
            return res.json(decrypted);
        } catch (err) {
            return res.status(400).json({ error: "Decryption failed" });
        }
    },
}
