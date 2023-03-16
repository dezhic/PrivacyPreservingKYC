/*
    Encrypt a plaintext (a point of babyjub curve) using a public key (also a point of babyjub curve)
    Output the encypted value

    Flaw: circom cannot generate random numbers. Therefore, we take the random number as an input.
        This flaw makes the function an INCOMPLETE implementation of ElGamal, due to the restriction of circom
        If the random number input `r` is fixed, anyone who knows `M` is able to calculate `h^r` and break
        the encryption of succeeding communications.

        This does not affect the security of our project, because only the Government role knows the decrypted `M`,
        which is the symmetric key for subsequently decryption the ciphertext (the token).
*/
pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/pointbits.circom";
include "../node_modules/circomlib/circuits/escalarmulany.circom";
include "../node_modules/circomlib/circuits/escalarmulfix.circom";
include "../node_modules/circomlib/circuits/babyjub.circom";

template ElGamalEncrypt() {
    signal input mX;      // x-coorinate of the plaintext
    signal input mY;      // y-coorinate of the plaintext
    signal input pubKeyX;
    signal input pubKeyY;
    signal input r;       // a random ephemeral key, taken as an input as circom cannot generate one

    signal sX;
    signal sY;

    signal output c1X;
    signal output c1Y;
    signal output c2X;
    signal output c2Y;

    var i;

    var BASE8[2] = [
        5299619240641551281634865583518297030282874472190772894086521144482721001553,
        16950150798460657717958625567821834550301663161624707787222815936182638968203
    ];

    // Calculate c1
    component num2bitsR = Num2Bits(254);
    num2bitsR.in <== r;

    component escalarMulFixC1 = EscalarMulFix(254, BASE8);
    for (i = 0; i < 254; i++) {
        escalarMulFixC1.e[i] <== num2bitsR.out[i];
    }
    c1X <== escalarMulFixC1.out[0];
    c1Y <== escalarMulFixC1.out[1];


    // Calculate shared secret (pubKey^r)
    component escalarMulAnyS = EscalarMulAny(254);
    for (i = 0; i < 254; i++) {
        escalarMulAnyS.e[i] <== num2bitsR.out[i];
    }
    escalarMulAnyS.p[0] <== pubKeyX;
    escalarMulAnyS.p[1] <== pubKeyY;
    sX <== escalarMulAnyS.out[0];
    sY <== escalarMulAnyS.out[1];

    component babyAddC2 = BabyAdd();
    babyAddC2.x1 <== mX;
    babyAddC2.y1 <== mY;
    babyAddC2.x2 <== sX;
    babyAddC2.y2 <== sY;
    
    c2X <== babyAddC2.xout;
    c2Y <== babyAddC2.yout;

    component babyAddDoubleC1 = BabyAdd();
    babyAddDoubleC1.x1 <== c1X;
    babyAddDoubleC1.y1 <== c1Y;
    babyAddDoubleC1.x2 <== c1X;
    babyAddDoubleC1.y2 <== c1Y;
}

// component main {public[pubKey]} = ElGamalEncrypt();
