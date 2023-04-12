const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const zkKycJs = require('zkkyc-js');

if (isMainThread) {
    console.log("main thread");
    module.exports = (didI, didHI, didHV, didV, sigS, sigR, issuerPubKey, govPubKey) => {
        console.log("main: generating zkKycProof for " + didI + " with " + didHI + " and " + didHV + " and " + didV + " and " + sigS + " and " + sigR + " and " + issuerPubKey + " and " + govPubKey);
        return new Promise((resolve, reject) => {
            console.log("main: creating worker");
            const worker = new Worker(__filename, { workerData: {
                didI: didI,
                didHI: didHI,
                didHV: didHV,
                didV: didV,
                sigS: sigS,
                sigR: sigR,
                issuerPubKey: issuerPubKey,
                govPubKey: govPubKey
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
        console.log("worker: workerData: " + JSON.stringify(workerData));
        const zkkyc = zkKycJs.holder.generateZkKycProof(
            workerData.didI,
            workerData.didHI,
            workerData.didHV,
            workerData.didV,
            workerData.sigS,
            workerData.sigR,
            workerData.issuerPubKey,
            workerData.govPubKey);
        parentPort.postMessage(zkkyc);
    } catch (err) {
        parentPort.postMessage(err);
    }
}
