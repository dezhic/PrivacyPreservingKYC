const axios = require("axios");
const holderDao = require('../dao/holder');
const genZk = require('../utils/generate-zkkyc-token');

const httpClient = axios.create({
    baseURL: 'http://159.138.47.211:8041',
});

module.exports = {
    index: async function (req, res) {
        res.render('holder/holder-wallet', { connections: await holderDao.getConnections() });
    },

    listCredentials: async function (req, res) {
        console.log("listCredentials");
        const credentialsRes = await httpClient.post('/credentials/w3c', {});
        // console.log(credentialsRes);
        res.json(credentialsRes.data.results.map(cred => cred.cred_value));
    },
    
    listConnections: async function (req, res) {
        const connections = await holderDao.getConnections();
        return res.json(connections);
    },

    receiveInvitation: async function (req, res) {
        const invitationUrl = req.body.invitation_url;
        const invitationBase64 = invitationUrl.split('?c_i=')[1];
        if (!invitationBase64) {
            return res.json({ error: 'Invalid invitation url' });
        }
        const invitation = JSON.parse(Buffer.from(invitationBase64, 'base64').toString('ascii'));
        console.log("Invitation: " + JSON.stringify(invitation));
        try {
            const result = await httpClient.post('/connections/receive-invitation', invitation);
            console.log("Received invitation: " + result.data.connection_id);
            console.log("Invitation response: " + JSON.stringify(result.data));
            await holderDao.createConnection(
                result.data.connection_id,
                invitation['@id'],
                invitation["did"],
                result.data.their_did,
                result.data.my_did,
                Date.now()
            );

            return res.json(result.data);
        } catch (err) {
            console.error("Error receiving invitation")
            console.error(err);
            return res.json({ error: err })
        }
    },

    generateZkKycToken: async function (req, res) {
        console.log("Generating proof for request: " + JSON.stringify(req.body));
        const proof = await genZk(
            req.body.did_i,
            req.body.did_hi,
            req.body.did_hv,
            req.body.did_v,
            req.body.sig.s,
            req.body.sig.r,
            req.body.pub_i,
            req.body.pub_g,
        );
        return res.json(proof);
    },

}
