const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const zkKycJs = require('zkkyc-js');

if (isMainThread) {
    console.log("main thread");
    module.exports = (proofJson, publicJson) => {
        return new Promise((resolve, reject) => {
            console.log("main: creating worker");
            const worker = new Worker(__filename, { workerData: {
                proofJson: proofJson,
                publicJson: publicJson
            }});
            console.log("main: worker created");
            worker.on('message', (msg) => {
                if (msg instanceof Error) {
                    reject(msg);
                } else {
                    resolve(msg);
                }
            });
        });
    }
} else {
    try {
        console.log("worker thread");
        const result = zkKycJs.verifier.verifyZkKycProof(workerData.proofJson, workerData.publicJson);
        parentPort.postMessage(result);
    } catch (err) {
        parentPort.postMessage(err);
    }
}
