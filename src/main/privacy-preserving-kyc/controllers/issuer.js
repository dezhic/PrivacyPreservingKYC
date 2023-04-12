const axios = require("axios");
const issuerDao = require('../dao/issuer');
const signDidRecord = require('../utils/sign-did-record');

const httpClient = axios.create({
    baseURL: 'http://159.138.47.211:8021',
});

async function getAllConnections(username) {
    const connInfo = await issuerDao.getConnectionsByUsername(username);
    const connections = [];
    for (let i = 0; i < connInfo.length; i++) {
        const connectionRes = await httpClient.get('/connections/' + connInfo[i].connection_id);
        connections.push(connectionRes.data);
    }
    return connections;
}


module.exports = {
    index: async function (req, res) {
        res.render('issuer/index', { title: 'Issuer' });
    },

    login: async function (req, res) {
        const customer = await issuerDao.getCustomerByUsername(req.body.username);
        if (customer.password === req.body.password) {
            req.session.username = req.body.username;
            const connections = await getAllConnections(req.body.username);
            return res.render('issuer/customer-portal', { customer: customer, connections: connections })
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
                return res.json({ error: "Duplicate username" });
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

    listConnections: async function (req, res) {
        const connections = await getAllConnections(req.session.username);
        return res.json(connections);
    },

    requestCredential: async (req, res) => {
        const customer = await issuerDao.getCustomerByUsername(req.session.username);
        const connInfo = await issuerDao.getConnectionByUsernameAndConnectionId(req.session.username, req.body.connection_id);
        if (!connInfo) {
            return res.json({ error: "No connection" });
        }
        const connectionPromise = httpClient.get('/connections/' + connInfo.connection_id);
        const connection = (await connectionPromise).data;
        if (connection.state !== 'active') {
            return res.json({ error: `Connection state is not active. Current state: ${connection.state}. Connection ID: ${connection.connection_id}` });
        }
        let publicDid;
        const publicDidPromise = httpClient.get('/wallet/did/public');
        try {
            const publicDidResult = (await publicDidPromise).data.result;
            publicDid = `did:${publicDidResult.method}:${publicDidResult.did}`;
        } catch (err) {
            return res.json({ error: "Cannot get public DID" });
        }

        let cred;
        console.log(customer.username + " is requesting " + req.body.type + " credential for " + connection.their_did);
        if (req.body.type === 'eligibility') {
            cred = {
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
            }
        } else if (req.body.type === 'kyc') {
            let sigJson;
            const key = {
                "pub": [
                    "95364b73b69447846f8de961c455757809eee2bbbb28bf9acac244a452edfe24",
                    "898f905a0398ad6008add36aa7db1c91e8fe77d126443fc55b037287c9248c94"
                ],
                "priv": "0000000000000000000000000000000000000000000000000000000000000000"
            };
            try {
                let sig = await signDidRecord(publicDid, "did:sov:" + connection.their_did, key.priv);
                sigJson = JSON.stringify(sig);
            } catch (err) {
                console.log(err);
                return res.json({ error: "Failed to sign DIDs", detail: err });
            }

            cred = {
                "auto_remove": false,
                "connection_id": connection.connection_id,
                "filter": {
                    "ld_proof": {
                        "credential": {
                            "@context": [
                                "https://www.w3.org/2018/credentials/v1",
                                {
                                    "@context": {
                                        "DidSig": "https://example.com/did-sig",
                                        "sig_json": "https://example.com/sig-json",
                                        "sig_pubkey": "https://example.com/sig-pubkey"
                                    }
                                }
                            ],
                            "type": [
                                "VerifiableCredential",
                                "DidSig"
                            ],
                            "issuer": publicDid,
                            "issuanceDate": new Date().toISOString(),
                            "credentialSubject": {
                                "id": "did:sov:" + connection.their_did,
                                "sig_json": sigJson,
                                "sig_pubkey": key.pub,
                            }
                        },
                        "options": {
                            "proofType": "Ed25519Signature2018"
                        }
                    }
                }
            }
        } else {
            return res.json({ error: 'Credential type should be "eligibility" or "kyc"' });
        }
        console.log(JSON.stringify(cred));
        try {
            const sendRes = await httpClient.post('/issue-credential-2.0/send', cred);
            console.log("sendRes.data: " + JSON.stringify(sendRes.data));
            await issuerDao.createCredentialInfo(
                sendRes.data.cred_ex_id,
                connection.their_did,
                customer.username,
                req.body.type,
                JSON.stringify(sendRes.data.by_format.cred_offer.ld_proof.credential),
                Date.now()
            );
            return res.json(sendRes.data);
        } catch (err) {
            console.log(err);
            return res.json({ error: "Failed to send credential or store credential info" });
        }
    },

    getInvitationByConnectionId: async (req, res) => {
        const connInfo = await issuerDao.getConnectionByUsernameAndConnectionId(req.session.username, req.query.connection_id);
        if (!connInfo) {
            return res.json({ error: "Not found" });
        }
        return res.json({ invitation_url: connInfo.invitation_url });
    },

    getCredentials: async (req, res) => {
        try {
            const creds = await issuerDao.getCredentialInfoByUsername(req.session.username);
            console.log("creds: " + JSON.stringify(creds));
            return res.json(creds);
        } catch (err) {
            console.log(err);
            return res.json({ error: "Failed to get credentials" });
        }
    },

}
