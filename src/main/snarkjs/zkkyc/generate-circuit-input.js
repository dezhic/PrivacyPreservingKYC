const { did2Uint248Array } = require("./utils");

function generateCircuitInput(didI, didHI, didHV, didV, sigS, sigR, issuerPubKey, govPubKey, aesKeyPoint, aesKeyXmXor, elGamalR, aesIV) {

    return {
        didI: did2Uint248Array(didI, 1).map(x => x.toString()),
        didHI: did2Uint248Array(didHI, 1).map(x => x.toString()),
        didHV: did2Uint248Array(didHV, 1).map(x => x.toString()),
        didV: did2Uint248Array(didV, 1).map(x => x.toString()),
        sigS: sigS.toString(),
        sigR: sigR.map(x => x.toString()),
        issuerPubKey: issuerPubKey.map(x => x.toString()),
        govPubKey: govPubKey.map(x => x.toString()),
        aesKeyPoint: aesKeyPoint.map(x => x.toString()),
        aesKeyXmXor: aesKeyXmXor.toString(),
        elGamalR: elGamalR.toString(),
        aesIV: aesIV
    }
}

let obj = generateCircuitInput(
    "did:sov:issuer0001abcdefghijklm",
    "did:peer:holder01forissuer00001",
    "did:peer:holder01forverifier001",
    "did:sov:verifier000123456789999",
    1136028128649729409669266589683482932995395727839539738114179291620991710713n,
    [
        10534710152468914581514035044315582700165596537604259014703652145388626356457n,
        2025851026844006284108539225340994401447633770260317337242805438214749812136n
    ],
    [
        14086576521545740791075161647679316992470619575303417964728534193474818210831n,
        9175871557843126123251579596103663768414704124400349808765789048425286496314n
    ],
    [
        9457769316781423715998926142557485068705968962136704442237205947890479333301n,
        5076597608459602620277182618355111479729374331745433788091247548674352025742n
    ],
    [
        7689419769125603274793075415052777702824574986848048290557099620099816379743n,
        13487094245585059003636596290308230257732123110960559801797825410625518894696n
    ],
    5739336036033480060141374364311236280255417146445434817466388900867901918441n,
    91274509273499459347523n,
    [0,0,1,0,1,0,0,0,1,0,1,1,0,1,1,1,1,0,1,0,1,0,1,1,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,1,0,0,0,0,1,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
)

console.log(JSON.stringify(obj));