#!/usr/bin/env node
const fs = require('fs');
const { uint248Array2Did } = require('./utils');

/**
 * Source: circomlib/test/sha256.js
 * @param {array} a an array of bits "0" or "1"
 * @returns {Buffer} a buffer of bytes
 */
function bitArray2buffer(a) {
    const len = Math.floor((a.length -1 )/8)+1;
    const b = new Buffer.alloc(len);

    for (let i=0; i<a.length; i++) {
        const p = Math.floor(i/8);
        b[p] = b[p] | (Number(a[i]) << ( 7 - (i%8)  ));
    }
    return b;
}

/**
 * Parse public.json into the specified public inputs and outputs
 * @param {array} array in the public.json file
 */
function parsePublicJson(publicJson) {
    let public = JSON.parse(publicJson);
    return {
        keyCipher: {
            c1: [
                public[0],
                public[1],
            ],
            c2: [
                public[2],
                public[3],
            ]
        },
        msgCipher: {
            cipher: bitArray2buffer(public.slice(4, 4+248*4)).toString("hex"),      // the cipher of 4 248-bit DIDs
            iv: bitArray2buffer(public.slice(4+248*4, 4+248*4+128)).toString("hex"),
        },
        didHV: uint248Array2Did([BigInt(public[1124])], 1),
        didV: uint248Array2Did([BigInt(public[1125])], 1),
        issuerPubKey: {
            x: public[1126],
            y: public[1127],
        },
        govPubKey: {
            x: public[1128],
            y: public[1129],
        },
        symKeyXmXor: public[1130],
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
