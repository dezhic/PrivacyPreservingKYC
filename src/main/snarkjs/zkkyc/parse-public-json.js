#!/usr/bin/env node
const fs = require('fs');
const { bitArray2buffer, uint248Array2Did } = require('./utils');

/**
 * Parse public.json into the specified public inputs and outputs
 * @param {array} array in the public.json file
 */
function parsePublicJson(publicJson) {
    let public = JSON.parse(publicJson);
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
        encryptedToken: {
            cipher: bitArray2buffer(public.slice(4, 4+1024)).toString("hex"),
            iv: bitArray2buffer(public.slice(4+1024, 4+1024+128)).toString("hex"),
        },
        didHV: uint248Array2Did([BigInt(public[1156])], 1),
        didV: uint248Array2Did([BigInt(public[1157])], 1),
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
}

function main() {
    const args = process.argv;
    if (args.length < 3) {
        console.log("Usage: node parse-public-json.js <path/to/public.json>");
        return;
    }
    const path = args[2];
    let file = fs.readFileSync(path);
    return parsePublicJson(file);
}

console.log(JSON.parse(JSON.stringify(main())));
