pragma circom 2.0.0;

include "../../circomlib/circuits/sha256/sha256.circom";
include "../../circomlib/circuits/bitify.circom";
include "../../circomlib/circuits/eddsaposeidon.circom";

template VerifyEdDSA(n256Bits) {

    signal input pubKey[2];
    signal input S;
    signal input R[2];
    signal input msg[n256Bits];

    signal hash;

    // // Calculate hash of msg
    // component sha256 = Sha256(msgByteLength*8);
    // for (var i = 0; i < msgByteLength*8; i++) {
    //     sha256.in[i] <== msg[i];
    // }

    // Calculate Poseidon hash of msg
    component poseidon = Poseidon(n256Bits);
    for (var i = 0; i < n256Bits; i++) {
        poseidon.inputs[i] <== msg[i];
    }
    hash <== poseidon.out;

    // component bits2numHash = Bits2Num(256);
    // for (var i = 0; i < 256; i++) {
    //     bits2numHash.in[i] <== sha256.out[i];
    // }
    // hash <== bits2numHash.out;

    // Verify Issuer's signature on the msg hash
    component verifier = EdDSAPoseidonVerifier();
    verifier.enabled <== 1;
    verifier.Ax <== pubKey[0];
    verifier.Ay <== pubKey[1];
    verifier.S <== S;
    verifier.R8x <== R[0];
    verifier.R8y <== R[1];
    verifier.M <== hash;
}

component main {public[pubKey]} = VerifyEdDSA(2);
