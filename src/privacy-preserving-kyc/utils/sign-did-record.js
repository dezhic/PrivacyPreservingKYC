const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const zkKycJs = require('zkkyc-js');

if (isMainThread) {
    module.exports = (publicDid, theirDid, privKey) => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, { workerData: { publicDid, theirDid, privKey } });
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
        const sig = zkKycJs.issuer.signDidRecord(workerData.publicDid, workerData.theirDid, workerData.privKey);
        parentPort.postMessage(sig);
    } catch (err) {
        parentPort.postMessage(err);
    }
}
