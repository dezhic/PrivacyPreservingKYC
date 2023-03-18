const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { government, holder, issuer, verifier } = require("./index");

const PROTO_PATH = "../protos/zkkyc.proto";
const HOLDER_PROTO_PATH = "../protos/holder.proto";
const ISSUER_PROTO_PATH = "../protos/issuer.proto";
const VERIFIER_PROTO_PATH = "../protos/verifier.proto";

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
        console.log(call.request);
        callback(null, { priv: 'asdf', pub: ['asdf', 'asdf'] });
    },
    signDidRecord: (call, callback) => {
        console.log(call.request);
        callback(null, { s: 'asdf', r: ['asdf', 'asdf'] });
    }
});

server.addService(zkkyc.Holder.service, {
    generateZkKycProof: (call, callback) => {
        console.log(call.request);
        callback(null, { proofJson: 'asdf', publicJson: 'asdf' });
    }
});

server.addService(zkkyc.Verifier.service, {
    parsePublic: (call, callback) => {
        console.log(call.request);
        callback(null, { parsedPublic: 'asdf' });
    },
    verifyZkKycProof: (call, callback) => {
        console.log(call.request);
        callback(null, { result: true });
    },
});

server.addService(zkkyc.Government.service, {
    generateKeyPair: (call, callback) => {
        console.log(call.request);
        callback(null, { priv: 'asdf', pub: ['asdf', 'asdf'] });
    },
    decryptZkKycToken: (call, callback) => {
        console.log(call.request);
        callback(null, {didI: 'asdf', did_hi: 'asdf', did_hv: 'asdf', did_v: 'asdf' });
    },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
