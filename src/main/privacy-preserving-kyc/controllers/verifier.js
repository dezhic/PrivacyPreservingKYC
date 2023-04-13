const parseToken = require('../utils/parse-zkkyc-token.js');
module.exports = {
    index: async function (req, res) {
        res.render('verifier/index', {});
    },

    parseToken: async function (req, res) {
        const parsed = await parseToken(req.body.token.publicJson);
        res.json(parsed);
    },

}
