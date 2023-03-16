const { did2Uint248Array } = require("./utils");

function generateCircuitInput(didI, didHI, didHV, didV, sigS, sigR, issuerPubKey, govPubKey, symKeyPoint, symKeyXmXor, elGamalR, aesIV) {

    return {
        didI: did2Uint248Array(didI, 1).map(x => x.toString()),
        didHI: did2Uint248Array(didHI, 1).map(x => x.toString()),
        didHV: did2Uint248Array(didHV, 1).map(x => x.toString()),
        didV: did2Uint248Array(didV, 1).map(x => x.toString()),
        sigS: sigS.toString(),
        sigR: sigR.map(x => x.toString()),
        issuerPubKey: issuerPubKey.map(x => x.toString()),
        govPubKey: govPubKey.map(x => x.toString()),
        symKeyPoint: symKeyPoint.map(x => x.toString()),
        symKeyXmXor: symKeyXmXor.toString(),
        elGamalR: elGamalR.toString(),
        aesIV: aesIV
    }
}

let obj = generateCircuitInput(
    "did:sov:issuer0001",
    "did:peer:holder01forissuer00001",
    "did:peer:holder01forverifier001",
    "did:sov:verifier0001",
    238928443438497484186866808750451396665314061648605674439325563899676330659n,
    [
        1635447119617517327422575240217311663749139804722094576607735889005592939521n,
        8760564403222018146338829872363673598289901196742146068207620305702693406361n
    ],
    [
        15379156865778897331383576932881380853207297647804185121867192023156937342514n,
        1697263844071114670332734400556420028819419733389455212829115721156704709008n
    ],
    [
        6062561184713984169649595866529436203177996048688890080695905594128283365108n,
        17718320674264021933111057112104708998966783832875896709847915677650713910040n
    ],
    [
        8127601353575943405739712930057125647156404366077832801588066460705707251692n,
        14195036242171338926993766311649227545606530491823006700961631389967399114690n
    ],
    4490713552133287422538077498007240407089460149420090676276534147958252165934n,
    123n,
    [1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
)

console.log(JSON.stringify(obj));