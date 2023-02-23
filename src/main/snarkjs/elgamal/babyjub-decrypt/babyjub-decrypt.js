const circomlibjs = require("circomlibjs");

/**
 * @param {Buffer} buffer 
 * @returns {BigInt}
 */
function readBigUInt256LE(buffer) {
    var value = 0n;
    for (var i = 0; i < 32; i++) {
        value += BigInt(buffer[i]) << BigInt((i * 8));
    }
    return value;
}

/**
 * 
 * @param {BigInt} value 
 * @returns {Buffer}
 */
function newBufferFromBigUInt256LE(value) {
    var buffer = Buffer.alloc(32);
    for (var i = 0; i < 32; i++) {
        buffer[i] = Number(value & 0xffn);
        value = value >> 8n;
    }
    return buffer;
}

/**
 * 
 * @param {BigInt} privKey 
 * @param {{c1: [BigInt, BigInt], c2: [BigInt, BigInt]}} cipher 
 */
async function decrypt(privKey, cipher) {
    const babyJub = await circomlibjs.buildBabyjub();
    // Convert point coordinates to bytes
    /* NOTE: Assuming little endianess here
       (The multiplication operation is eventually done by wasm. See iden3/wasmbuilder)
     */
    var c1XBuf = newBufferFromBigUInt256LE(cipher.c1[0]);
    var c1YBuf = newBufferFromBigUInt256LE(cipher.c1[1]);
    var c2XBuf = newBufferFromBigUInt256LE(cipher.c1[0]);
    var c2YBuf = newBufferFromBigUInt256LE(cipher.c1[1]);
    // var privKeyBuf = newBufferFromBigUInt256LE(privKey);
    
    // Compute shared secret s
    var sBufs = babyJub.mulPointEscalar([c1XBuf, c1YBuf], privKey);
    var s = [
        readBigUInt256LE(sBufs[0]), 
        readBigUInt256LE(sBufs[1])
    ];

    // var sInv = [
    //     babyJub.F.e(-1n * s[0]),
    //     s[1]
    // ];
    // TODO: Check the correct inverse form
    var sInvXBuf = newBufferFromBigUInt256LE(s[0]);
    var sInvYBuf = babyJub.F.e(-1n * s[1]);

    var sInv = [
        s[0],
        readBigUInt256LE(sInvYBuf)
    ];

    var mPoint = babyJub.addPoint([c2XBuf, c2YBuf], [sInvXBuf, sInvYBuf]);

    // Point 2 bits
    var mBuf = babyJub.packPoint(mPoint)

    // Bits 2 Num
    var m = readBigUInt256LE(mBuf);
    
    return m;
}

async function convertKey() {
    const babyJub = await circomlibjs.buildBabyjub();
    var pubKeyScalar = babyJub.packPoint([
        newBufferFromBigUInt256LE(3023566735804369038972691568220909424085019580955991986362956745157881967415n),
        newBufferFromBigUInt256LE(11665917637360102114499541975773473260640937171104272372374446321106735965252n)
    ]);
    console.log("pubKeyScalar: " + readBigUInt256LE(pubKeyScalar));

    var privKeyBuf = [248, 205, 129, 112, 129, 79, 119, 56, 165, 8, 79, 253, 49, 213, 151, 158, 112, 160, 62, 228, 62, 67, 178, 139, 36, 179, 52, 238, 109, 232, 178, 93];
    console.log("privKeyScalar: " + readBigUInt256LE(privKeyBuf));
}

convertKey();

decrypt(42381197864646973507276111536086772340011856814740557481583833230297660509688n,
    {
        c1: [
            1n,
            1n
        ],
        c2: [
            2n,
            2n
        ]
    }).then(res => console.log(res));
