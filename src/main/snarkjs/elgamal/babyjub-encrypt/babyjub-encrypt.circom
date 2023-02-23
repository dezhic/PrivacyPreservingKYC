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

include "../circomlib/circuits/bitify.circom";
include "../circomlib/circuits/pointbits.circom";
include "../circomlib/circuits/escalarmul.circom";
include "../circomlib/circuits/escalarmulfix.circom";
include "../circomlib/circuits/babyjub.circom";

template ElGamalEncrypt() {
    signal input m;
    signal input pubKey;
    signal input r;  // the ephemeral key, taken as an input as circom cannot generate one

    signal mX;
    signal mY;
    signal pubKeyX;
    signal pubKeyY;
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

    // Convert message m to field element
    component num2bitsM = Num2Bits(256);
    num2bitsM.in <== m;

    component bits2pointM = Bits2Point_Strict();
    for (i = 0; i < 256; i++) {
        bits2pointM.in[i] <== num2bitsM.out[i];
    }
    mX <== bits2pointM.out[0];
    mY <== bits2pointM.out[1];

    // Convert public key pubKey to field element
    component num2bitsPubKey = Num2Bits(256);
    num2bitsPubKey.in <== pubKey;

    component bits2pointPubKey = Bits2Point_Strict();
    for (i = 0; i < 256; i++) {
        bits2pointPubKey.in[i] <== num2bitsPubKey.out[i];
    }
    pubKeyX <== bits2pointPubKey.out[0];
    pubKeyY <== bits2pointPubKey.out[1];

    // Calculate c1
    component num2bitsR = Num2Bits(256);
    num2bitsR.in <== r;

    component escalarMulFixC1 = EscalarMulFix(256, BASE8);
    for (i = 0; i < 256; i++) {
        escalarMulFixC1.e[i] <== num2bitsR.out[i];
    }
    c1X <== escalarMulFixC1.out[0];
    c1Y <== escalarMulFixC1.out[1];

    // Calculate shared secret (pubKey^r)
    component escalarMulS = EscalarMul(256, BASE8);
    for (i = 0; i < 256; i++) {
        escalarMulS.in[i] <== num2bitsR.out[i];
    }
    escalarMulS.inp[0] <== pubKeyX;
    escalarMulS.inp[1] <== pubKeyY;
    sX <== escalarMulS.out[0];
    sY <== escalarMulS.out[1];

    component babyAddC2 = BabyAdd();
    babyAddC2.x1 <== mX;
    babyAddC2.y1 <== mY;
    babyAddC2.x2 <== sX;
    babyAddC2.y2 <== sY;
    
    c2X <== babyAddC2.xout;
    c2Y <== babyAddC2.yout;
}

component main {public[pubKey]} = ElGamalEncrypt();
