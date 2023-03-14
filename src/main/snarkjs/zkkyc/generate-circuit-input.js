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
    "did:peer:holder01forissuer00001",
    "did:peer:holder01forissuer00001",
    "did:sov:verifier0001",
    135051018849253685040720510825733356332519604956542188680882041768459521462n,
    [
        13539307697398055093970576606172516929585066929328555048578069428222281262883n,
        14693150300632227339203818124221076679618253379122122647469416451148515758809n
    ],
    [
        7970796174300684104239510983918283945741258581019242111663651795930249204081n,
        10557250643281454539403664008522538759562055216354985639351565925293443459939n
    ],
    [
        3805358752689812909583635566348661271344212060037908443091906028226388989777n,
        6898281485135969687684693871738377129105343133003733747870731112065777525389n
    ],
    18690094288085381307187836631857061030373478003478318898768261670836995815337n,
    18657930686751611886087768925286853671762521747200281783072771157398146272119n,
    123n,
    [1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
)

console.log(JSON.stringify(obj));