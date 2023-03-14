const { did2Uint248Array } = require("./utils");

function generateCircuitInput(didI, didHI, didHV, didV, sigS, sigR, issuerPubKey, govPubKey, symKeyPointX, symKeyXmXor, elGamalR, aesIV) {

    return {
        didI: did2Uint248Array(didI, 1).map(x => x.toString()),
        didHI: did2Uint248Array(didHI, 1).map(x => x.toString()),
        didHV: did2Uint248Array(didHV, 1).map(x => x.toString()),
        didV: did2Uint248Array(didV, 1).map(x => x.toString()),
        sigS: sigS.toString(),
        sigR: sigR.map(x => x.toString()),
        issuerPubKey: issuerPubKey.map(x => x.toString()),
        govPubKey: govPubKey.map(x => x.toString()),
        symKeyPointX: symKeyPointX.toString(),
        symKeyXmXor: symKeyXmXor.toString(),
        elGamalR: elGamalR.toString(),
        aesIV: aesIV
    }
}

let obj = generateCircuitInput(
    "did:sov:issuer0001",
    "did:peer:holder01forissuer0001",
    "did:peer:holder01forverifier001",
    "did:sov:verifier0001",
    1554717655016521060271161140479589612652187059104646400366492745279240160110n,
    [
        11248111020562960856849605953298506830021264171919005796023819595879460163746n,
        14450771898786856057091154816159541085056166700506967923906510916912316717064n
    ],
    [
        15001822971397290346472247202728441229251410568151017477464733566048371562505n,
        14865015681931850160581775514340871039523618788831821735073434585753955056856n
    ],
    [
        539172921082135762038930720952227503978126225290781223441279912817622518169n,
        16847794319964794072176888869224687142792615446258712172253902929022682026608n
    ],
    16432778586053629570915061783371334504039264856272445317835846964378850526268n,
    24595905147914404331010105127150623580092039806665419016254838897153600608972n,
    123n,
    [1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
)

console.log(JSON.stringify(obj));