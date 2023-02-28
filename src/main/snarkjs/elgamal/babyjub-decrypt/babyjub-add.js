const circomlibjs = require("circomlibjs");
const jscrypto = require("@iden3/js-crypto");

async function testAdd() {
    const readBigUInt256LE = (buffer) => {
        var value = 0n;
        for (var i = 0; i < 32; i++) {
            value += BigInt(buffer[i]) << BigInt((i * 8));
        }
        return value;
    };

    const newBufferFromBigUInt256LE = (value) => {
        var buffer = Buffer.alloc(32);
        for (var i = 0; i < 32; i++) {
            buffer[i] = Number(value & 0xffn);
            value = value >> 8n;
        }
        return buffer;
    };

    // const babyjub = await circomlibjs.buildBabyjub();
    const babyjub = jscrypto.babyJub;
    const c1X = 5299619240641551281634865583518297030282874472190772894086521144482721001553n;
    const c1Y = 16950150798460657717958625567821834550301663161624707787222815936182638968203n;
    // const c1 = [c1X, c1Y].map(newBufferFromBigUInt256LE);
    const c1 = [c1X, c1Y];

    const sum = babyjub.addPoint(c1, c1);
    // console.log(sum.map(readBigUInt256LE));
    console.log(sum);
}

testAdd();