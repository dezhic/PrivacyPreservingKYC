const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const zkKycJs = require('zkkyc-js');

if (isMainThread) {
    module.exports = (parsedToken, privKey) => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, { workerData: { parsedToken, privKey } });
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
        const decrypted = zkKycJs.government.decryptToken(workerData.parsedToken, workerData.privKey);
        parentPort.postMessage(decrypted);
    } catch (err) {
        parentPort.postMessage(err);
    }
}
