const axios = require("axios");

const httpClient = axios.create({
    baseURL: 'http://159.138.47.211:8041',
});

module.exports = {
    listCredentials: async function (req, res) {
        const credentialsRes = await httpClient.post('/credentials/w3c', {});
        res.json(credentialsRes.data);
    },
    
    receiveInvitation: async function (req, res) {
        const invitationUrl = req.body.invitation_url;
        const invitationBase64 = invitationUrl.split('?c_i=')[1];
        if (!invitationBase64) {
            return res.json({ error: 'Invalid invitation url' });
        }
        const invitation = JSON.parse(Buffer.from(invitationBase64, 'base64').toString('ascii'));
        try {
            const result = await httpClient.post('/connections/receive-invitation', invitation);
            return res.json(result.data);
        } catch (err) {
            return res.json({ error: err })
        }
    }
}
