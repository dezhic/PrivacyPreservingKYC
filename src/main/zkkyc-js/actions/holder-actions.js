const fs = require('fs');
const { execSync } = require('child_process');
const crypto = require('crypto');
const { aesKeyGen } = require('../services/keygen');
const { randomUint253, beBuffer2bitArray, hexToUint256 } = require('../services/utils');
const generateCircuitInput = require('../services/generate-circuit-input');

const WORKING_DIR = './proof/tmp';
fs.mkdirSync(WORKING_DIR, { recursive: true });

module.exports = {
    generateZkKycProof: (didI, didHI, didHV, didV, sigS, sigR, issuerPubKey, govPubKey) => {
        
        const aesKey = aesKeyGen().encodedKey; // Generate encoded AES key
        
        const aesIV = beBuffer2bitArray(crypto.randomBytes(16)); // Generate AES initial vector (128-bit)
        
        const elGamalR = randomUint253(); // Generate ElGamal random number (253-bit)


        // Generate circuit input file
        const input = generateCircuitInput(
            didI, didHI, didHV, didV,
            hexToUint256(sigS), sigR.map(hexToUint256), issuerPubKey.map(hexToUint256), govPubKey.map(hexToUint256),
            aesKey.point, aesKey.xmXor, elGamalR, aesIV
        );

        const fileId = crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex').slice(0, 8);
        const inputFilePath = WORKING_DIR + `/${fileId}_input.json`;
        const witnessFilePath = WORKING_DIR + `/${fileId}_witness.wtns`;
        const publicFilePath = WORKING_DIR + `/${fileId}_public.json`;
        const proofFilePath = WORKING_DIR + `/${fileId}_proof.json`;

        // Write input file
        fs.writeFileSync(inputFilePath, JSON.stringify(input));
        console.log('Generated input file: ' + inputFilePath);

        // Generate witness file
        console.log('Generating witness file...');
        console.log(execSync(`node proof/generate_zkkyc_token_js/generate_witness.js proof/generate_zkkyc_token_js/generate_zkkyc_token.wasm ${inputFilePath} ${witnessFilePath}`).toString());
        console.log('Generated witness file: ' + witnessFilePath);

        // Prove with snarkjs
        console.log('Proving with snarkjs...');
        console.log(execSync(`snarkjs groth16 prove proof/generate_zkkyc_token.zkey ${witnessFilePath} ${proofFilePath} ${publicFilePath}`).toString());
        console.log('Generated proof file: ' + proofFilePath + ' and public file: ' + publicFilePath);
        
        // Read proof files (proof.json & public.json)
        const proof = JSON.parse(fs.readFileSync(proofFilePath));
        const public = JSON.parse(fs.readFileSync(publicFilePath));
        
        // Clean up files
        console.log('Cleaning up files...');
        fs.rm(inputFilePath, (err) => { if (err) console.log(err) });
        console.log('Removed input file: ' + inputFilePath);
        fs.rm(witnessFilePath, (err) => { if (err) console.log(err) });
        console.log('Removed witness file: ' + witnessFilePath);
        fs.rm(proofFilePath, (err) => { if (err) console.log(err) });
        console.log('Removed proof file: ' + proofFilePath);
        fs.rm(publicFilePath, (err) => { if (err) console.log(err) });
        console.log('Removed public file: ' + publicFilePath);

        return {
            proof: proof,
            public: public,
        }
    },
}
