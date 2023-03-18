const fs = require('fs');
const { spawnSync } = require('child_process');
const { beBitArray2buffer, leUint248Array2Did } = require('../services/utils');

const WORKING_DIR = './proof/tmp';
fs.mkdirSync(WORKING_DIR, { recursive: true });

module.exports = {
    /**
     * Parse public file content into the specified public inputs and outputs
     * @param {array} public array in the public.json file
     * @returns 
     */
    parsePublic: function (public) {
        return {
            aesKeyPointCipher: {
                c1: [
                    public[0],
                    public[1],
                ],
                c2: [
                    public[2],
                    public[3],
                ]
            },
            encryptedToken: beBitArray2buffer(public.slice(4, 4+1024+128)).toString("hex"),  // 1024 bits for the cipher, 128 bits for the iv
            didHV: leUint248Array2Did([BigInt(public[1156])]),
            didV: leUint248Array2Did([BigInt(public[1157])]),
            issuerPubKey: {
                x: public[1158],
                y: public[1159],
            },
            govPubKey: {
                x: public[1160],
                y: public[1161],
            },
            aesKeyXmXor: public[1162],
        }
    },

    /**
     * Verify zk-SNARK proof with snarkJS
     * @param {object} proof proof object
     * @param {array} public public inputs and outputs
     * @returns {boolean} true if proof is valid, false otherwise
     */
    verifyZkKycProof: function (proof, public) {
        const proofId = crypto.createHash('sha256').update(JSON.stringify(proof)).digest('hex').slice(0, 8);
        fs.writeFileSync(`${WORKING_DIR}/${proofId}_proof.json`, JSON.stringify(proof));
        console.log(`Proof written to ${WORKING_DIR}/${proofId}_proof.json`);
        fs.writeFileSync(`${WORKING_DIR}/${proofId}_public.json`, JSON.stringify(public));
        console.log(`Public inputs/outputs written to ${WORKING_DIR}/${proofId}_public.json`);

        console.log("Verifying proof...");
        let result = spawnSync('snarkjs', [
            'groth16',
            'verify',
            'proof/verification_key.json',
            `${WORKING_DIR}/${proofId}_public.json`,
            `${WORKING_DIR}/${proofId}_proof.json`]);
        console.log(result.stdout.toString());
        console.log(result.stderr.toString());
        
        console.log('Cleaning up files...');
        fs.rm(`${WORKING_DIR}/${proofId}_proof.json`, (err) => { if (err) console.log(err); });
        console.log(`Proof file ${WORKING_DIR}/${proofId}_proof.json deleted`);
        fs.rm(`${WORKING_DIR}/${proofId}_public.json`, (err) => { if (err) console.log(err); });
        console.log(`Public inputs/outputs file ${WORKING_DIR}/${proofId}_public.json deleted`);

        if (result.status != 0) {
            return false;
        } else {
            return true;
        }

    },

}
