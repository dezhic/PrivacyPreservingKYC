const axios = require("axios");
const issuerDao = require('../dao/issuer');

const httpClient = axios.create({
    baseURL: 'http://159.138.47.211:8021',
});

module.exports = {
    index: async function (req, res) {
        res.render('issuer/index', { title: 'Issuer' });
    },

    login: async function (req, res) {
        const customers = await issuerDao.getCustomerByUsername(req.body.username);
        if (customers.password === req.body.password) {
            req.session.username = req.body.username;
            return res.json({ message: 'success' });
        } else {
            return res.json({ error: 'Incorrect username/password' });
        }
    },

    signup: async function (req, res) {
        try {
            await issuerDao.createCustomer(
                req.body.username,
                req.body.password,
                req.body.name,
                req.body.passport_no,
                req.body.birth_date,
                req.body.nationality,
                Date.now());
            return res.json({ message: 'success' });
        } catch (err) {
            if (err.errno === 19) {
                return res.json({error: "Duplicate username"});
            }
            console.log(err);
            res.json(err);
        }
    },

    getCustomerInfo: async function (req, res) {
        const customer = await issuerDao.getCustomerByUsername(req.session.username);
        return res.json(customer);
    },

    createInvitation: async function (req, res) {
        const customer = await issuerDao.getCustomerByUsername(req.session.username);
        const result = await httpClient.post('/connections/create-invitation', {}, {
            params: {
                alias: customer?.username,
                auto_accept: true,
                public: true,
            }
        });
        await issuerDao.createConnection(customer.username, result.data.connection_id, result.data.invitation_url, Date.now());
        res.json(result.data);
    },

    getLastConnection: async function (req, res) {
        const connInfo = await issuerDao.getLastConnection(req.session.username);
        if (connInfo) {
            const connectionRes = await httpClient.get('/connections/' + connInfo.connection_id);
            return res.json(connectionRes.data);
        } else {
            return res.json(null);
        }
    },

    requestCredential: async (req, res) => {
        const connInfo = await issuerDao.getLastConnection(req.session.username);
        if (!connInfo) {
            return res.json({error: "No connection"});
        }
        const customer = await issuerDao.getCustomerByUsername(req.session.username);
        const connectionPromise = httpClient.get('/connections/' + connInfo.connection_id);
        const publicDidPromise = httpClient.get('/wallet/did/public');
        const connection = (await connectionPromise).data;
        if (connection.state !== 'active') {
            return res.json({error: `Connection state is not active. Current state: ${connection.state}. Connection ID: ${connection.connection_id}`});
        }
        let publicDid;
        try {
            const publicDidResult = (await publicDidPromise).data.result;
            publicDid = `did:${publicDidResult.method}:${publicDidResult.did}`;
        } catch (err) {
            return res.json({error: "Cannot get public DID"});
        }
        
        const sendRes = await httpClient.post('/issue-credential-2.0/send', {
            "auto_remove": false,
            "connection_id": connection.connection_id,
            "filter": {
                "ld_proof": {
                    "credential": {
                        "@context": [
                            "https://www.w3.org/2018/credentials/v1",
                            "https://json-ld.org/contexts/person.jsonld"
                        ],
                        "type": [
                            "VerifiableCredential",
                            "Person"
                        ],
                        "issuer": publicDid,
                        "issuanceDate": new Date().toISOString(),
                        "credentialSubject": {
                            "id": "did:sov:" + connection.their_did,
                            "born": customer.birth_date,
                            "nationality": customer.nationality,
                        }
                    },
                    "options": {
                        "proofType": "Ed25519Signature2018"
                    }
                }
            }
        });
        res.json(sendRes.data);
    },

    getInvitationByConnectionId: async (req, res) => {
        const connInfo = await issuerDao.getConnectionByUsernameAndConnectionId(req.session.username, req.query.connection_id);
        if (!connInfo) {
            return res.json({error: "Not found"});
        }
        return res.json({ invitation_url: connInfo.invitation_url });
    },

    getCredentials: async (req, res) => {
        const connection = await issuerDao.getLastConnection(req.session.username);
        if (!connection) {
            return res.json({error: "No connection"});
        }
        const result = await httpClient.get('/issue-credential-2.0/records', {
            params: {
                connection_id: connection.connection_id,
            }
        });
        res.json(result.data);
    },

}
