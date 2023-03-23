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
        const customers = await issuerDao.getCustomerByUsername(req.query.username);
        res.json(customers);
    },

    signup: async function (req, res) {
        await issuerDao.createCustomer(
            req.body.username,
            req.body.password,
            req.body.name,
            req.body.passport_no,
            req.body.birth_date,
            req.body.nationality,
            Date.now());
        res.json({ message: 'success' });
    },

    requestCredential: async (req, res) => {
        const result = await httpClient.post('/issue-credential-2.0/send', {
            "auto_remove": true,
            "connection_id": "25a693ec-276c-4f6f-ab13-d0aba533b4e1",
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
                        "issuer": "did:sov:Ne1Ld4DR19nxXpvHEFu4EW",
                        "issuanceDate": "2023-01-01T12:00:00Z",
                        "credentialSubject": {
                            "id": "did:key:aksdkajshdkajhsdkjahsdkjahsdj",
                            "born": "2000-12-20",
                            "nationality": "CN"
                        }
                    },
                    "options": {
                        "proofType": "Ed25519Signature2018"
                    }
                }
            }
        });
        res.json(result.data);
    }
}
