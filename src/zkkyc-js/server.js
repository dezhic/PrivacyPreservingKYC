const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { government, holder, issuer, verifier } = require("./index");

const PROTO_PATH = "../protos/zkkyc.proto";

const options = {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const zkkyc = grpc.loadPackageDefinition(protoLoader.loadSync(PROTO_PATH, options)).zkkyc;

const server = new grpc.Server();

server.addService(zkkyc.Issuer.service, {
    generateKeyPair: (call, callback) => {
        console.log('Issuer::generateKeyPair invoked');
        callback(null, issuer.generateKeyPair(call.request.privKey));
    },
    signDidRecord: (call, callback) => {
        console.log('Issuer::signDidRecord invoked');
        const sig = issuer.signDidRecord(call.request.didI, call.request.didHI, call.request.privKey);
        callback(null, sig);
    }
});

server.addService(zkkyc.Holder.service, {
    generateZkKycProof: (call, callback) => {
        console.log('Holder::generateZkKycProof invoked');
        const proof = holder.generateZkKycProof(
            call.request.didI,
            call.request.didHI,
            call.request.didHV,
            call.request.didV,
            call.request.sigS,
            call.request.sigR,
            call.request.issuerPubKey,
            call.request.govPubKey);
        callback(null, proof);
    }
});

server.addService(zkkyc.Verifier.service, {
    parsePublic: (call, callback) => {
        console.log('Verifier::parsePublic invoked');
        const parsed = verifier.parsePublic(call.request.publicJson);
        callback(null, parsed);
    },
    verifyZkKycProof: (call, callback) => {
        console.log('Verifier::verifyZkKycProof invoked');
        const result = verifier.verifyZkKycProof(call.request.proofJson, call.request.publicJson);
        callback(null, { result: result });
    },
});

server.addService(zkkyc.Government.service, {
    generateKeyPair: (call, callback) => {
        console.log('Government::generateKeyPair invoked');
        callback(null, issuer.generateKeyPair(call.request.privKey));
    },
    decryptZkKycToken: (call, callback) => {
        console.log('Government::decryptZkKycToken invoked');
        const decrypted = government.decryptToken(call.request.parsedPublic, call.request.privKey);
        callback(null, decrypted);
    },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
