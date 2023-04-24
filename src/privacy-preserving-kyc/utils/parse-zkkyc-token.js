const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const zkKycJs = require('zkkyc-js');

if (isMainThread) {
    console.log("main thread");
    module.exports = (publicJson) => {
        return new Promise((resolve, reject) => {
            console.log("main: creating worker");
            const worker = new Worker(__filename, { workerData: {
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
        // console.log("worker: workerData: " + JSON.stringify(workerData));
        const parsed = zkKycJs.verifier.parsePublic(workerData.publicJson);
        parentPort.postMessage(parsed);
    } catch (err) {
        parentPort.postMessage(err);
    }
}
