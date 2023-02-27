const circomlibjs = require("circomlibjs");
const maci = require('maci-crypto');

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
    var c2XBuf = newBufferFromBigUInt256LE(cipher.c2[0]);
    var c2YBuf = newBufferFromBigUInt256LE(cipher.c2[1]);
    // var privKeyBuf = newBufferFromBigUInt256LE(privKey);
    
    // Compute shared secret s
    var sBufs = babyJub.mulPointEscalar([c1XBuf, c1YBuf], privKey);
    var s = [
        readBigUInt256LE(sBufs[0]), 
        readBigUInt256LE(sBufs[1])
    ];


    console.log("s");
    console.log(s);
    console.log("sBufs");
    console.log(sBufs);


    // var sInv = [
    //     babyJub.F.e(-1n * s[0]),
    //     s[1]
    // ];
    // TODO: Check the correct inverse form
    var sInvXBuf = babyJub.F.e(-1n * s[0]);
    var sInvYBuf = newBufferFromBigUInt256LE(s[1]);
    
    var sInv = [
        readBigUInt256LE(sInvXBuf),
        s[1]
    ];

    var origin = babyJub.addPoint(
        [sInvXBuf, sInvYBuf],
        sBufs
        );
    
    console.log("Origin");
    console.log(origin);

    var mPoint = babyJub.addPoint([c2XBuf, c2YBuf], [sInvXBuf, sInvYBuf]);

    // Point 2 bits
    var mBuf = babyJub.packPoint(mPoint)

    // Bits 2 Num
    var m = readBigUInt256LE(mBuf);
    
    return m;
}

async function convertKey() {
    const babyJub = await circomlibjs.buildBabyjub();
    // var pubKeyBuf = babyJub.packPoint([
    //     newBufferFromBigUInt256LE(7534816647035517231425977115349035084184202894547679021012529989055792887190n),
    //     newBufferFromBigUInt256LE(10091555560160254475827974797555291382764795683221151119572771202785767680759n)
    // ]);
    // 看起来 go-babyjub 把pubkey compress 成bigint的方式和这里不一样，以下是go给出的buffer
    var pubKeyBuf = [247, 106, 73, 126, 194, 188, 99, 162, 199, 136, 229, 0, 210, 200, 117, 159, 136, 101, 244, 60, 41, 177, 90, 47, 142, 197, 153, 137, 55, 158, 79, 22];
    console.log("pubKeyScalar: " + readBigUInt256LE(pubKeyBuf));

    var privKeyBuf = [106, 250, 144, 28, 241, 83, 74, 93, 228, 127, 11, 189, 5, 164, 138, 20, 98, 140, 89, 99, 205, 80, 184, 237, 71, 186, 112, 159, 151, 222, 131, 243];
    console.log("privKeyScalar: " + readBigUInt256LE(privKeyBuf));
}

async function messageGen() {
    const babyJub = await circomlibjs.buildBabyjub();
    const buf = babyJub.F.e("60400098");
    const scalar = readBigUInt256LE(buf);
    const pointBuf = babyJub.unpackPoint(buf);  // SHOULD NOT USE UNPACK! IT'S DIFFERENT FROM UNCOMPRESS
    const mPoint = {
        x: readBigUInt256LE(pointBuf[0]),
        y: readBigUInt256LE(pointBuf[1])
    }
    // const buffer = [61, 234, 125, 98, 231, 124, 239, 250, 29, 153, 113, 160, 175, 201, 205, 217, 159, 89, 229, 70, 53, 62, 35, 16, 235, 33, 25, 251, 12, 231, 207, 202];
    // const scalar = readBigUInt256LE(buffer);
    console.log("mBuf: " + buf);
    console.log("m: " + scalar);
    console.log("m Point:");
    console.log(mPoint);

    console.log('--- compress test ---');
    console.log("pointbuf");
    console.log(pointBuf);
    console.log('packed')
    const compressed = babyJub.packPoint(pointBuf);
    console.log(compressed);
    console.log(readBigUInt256LE(compressed));
    console.log('--- end of compress test ---');

}

async function rGen() {
    // const buffer = [63, 201, 43, 8, 213, 66, 253, 230, 3, 17, 177, 198, 8, 24, 140, 18, 156, 244, 139, 219, 167, 124, 166, 27, 157, 82, 245, 243, 228, 25, 108, 41]
    // const scalar = readBigUInt256LE(buffer);
    const babyJub = await circomlibjs.buildBabyjub();
    const scalar = readBigUInt256LE(babyJub.F.e("852"));
    console.log("r: " + scalar);
}

async function messagePointGen() {
    // Message should be a point of the curve
    // The old `messageGen` function is probably wrong
    // In this function, we will use a generated "Public Key Point" as the message point
    const babyJub = await circomlibjs.buildBabyjub();
    const buf = [179, 228, 235, 117, 76, 34, 222, 74, 101, 82, 37, 98, 124, 100, 64, 213, 194, 75, 98, 167, 64, 146, 249, 188, 55, 183, 15, 157, 207, 137, 82, 42];
    const scalar = readBigUInt256LE(buf);
    const pointBuf = babyJub.unpackPoint(buf);  // SHOULD NOT USE UNPACK! IT'S DIFFERENT FROM UNCOMPRESS
    const mPoint = {
        x: readBigUInt256LE(pointBuf[0]),
        y: readBigUInt256LE(pointBuf[1])
    }
    console.log("mBuf: " + buf);
    console.log("m: " + scalar);
    console.log("m Point:");
    console.log(mPoint);

    console.log('--- pack test ---');
    console.log("pointbuf");
    console.log(pointBuf);
    console.log('packed')
    const packed = babyJub.packPoint(pointBuf);
    console.log(packed);
    console.log(readBigUInt256LE(packed));
    console.log('--- end of pack test ---');
}

convertKey();
// messageGen();
messagePointGen();
// rGen();

decrypt(6060017416189472310559253095194278711516883818896935597387392377662717375719n,
    {
        c1: [
            5299619240641551281634865583518297030282874472190772894086521144482721001553n,
            16950150798460657717958625567821834550301663161624707787222815936182638968203n
        ],
        c2: [
            7271351384126769311485155658060609834943508994626727574773010316163709867275n,
            780155605817610756951457743207956173696555418346144264060685625726796556649n
        ]
    }).then(res => console.log("DECRYPTED: " + res));
