pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/eddsaposeidon.circom";

/**
 * @param {number} n248Bits - Length of msg, measured in the number of 248-bit chunks
 */
template VerifyEdDSA(n248Bits) {

    signal input pubKey[2];
    signal input S;
    signal input R[2];
    signal input msg[n248Bits];

    signal hash;

    // 1. Calculate Poseidon hash of msg
    component poseidon = Poseidon(n248Bits);
    for (var i = 0; i < n248Bits; i++) {
        poseidon.inputs[i] <== msg[i];
    }
    hash <== poseidon.out;

    // 2. Verify Issuer's signature on the msg hash
    component verifier = EdDSAPoseidonVerifier();
    verifier.enabled <== 1;
    verifier.Ax <== pubKey[0];
    verifier.Ay <== pubKey[1];
    verifier.S <== S;
    verifier.R8x <== R[0];
    verifier.R8y <== R[1];
    verifier.M <== hash;
}
