pragma circom 2.0.0;

include "../eddsa/verify/verify_eddsa.circom";


/*
 * - __DID encoding__:
 *   A DID is encoded into chunks of __bytes__ of length (n256Bits * 32)
 *   Then convert each 32-byte chunk into a 256-bit bigint (little endian)
 *   Finally, represent a DID as an array of 256-bit bigints
 * 
 * @param n256Bits: number of 256-bit bigints to represent a DID
 */
template GenerateZkKYCToken(n256Bits) {
    signal input didI[n256Bits];
    signal input didHI[n256Bits];
    signal input didHV[n256Bits];
    signal input didV[n256Bits];
    signal input sigS;      // Issuer's signature on sha256(concat(didI,didHI)) (S part of EdDSA signature)
    signal input sigR[2];   // Issuer's signature on sha256(concat(didI,didHI)) (R part of EdDSA signature)
    signal input issuerPubKey[2];  // Issuer's public key for signature verification

    signal input govPubKey[2];  // Government's public key for encryption

    // Encryption parameters
    signal input symKeyPointX;  // x-coordinate of symKey babyjub encoding point
    signal input symKeyXmXor;  // XOR of symKey and the x-coordinate of symKeyPoint
    signal input r;       // random number r for ElGamal

    signal output c1[2];
    signal output c2[2];

    signal output symCipher;

    signal hash;

    /* Step 1: Verify Issuer's signature on DID_I, DID_HI */
    component verifyEdDSA = VerifyEdDSA(2*n256Bits);
    verifyEdDSA.pubKey[0] <== issuerPubKey[0];
    verifyEdDSA.pubKey[1] <== issuerPubKey[1];
    verifyEdDSA.S <== sigS;
    verifyEdDSA.R[0] <== sigR[0];
    verifyEdDSA.R[1] <== sigR[1];
    for (var i = 0; i < n256Bits; i++) {
        verifyEdDSA.msg[i] <== didI[i];
    }
    for (var i = 0; i < n256Bits; i++) {
        verifyEdDSA.msg[i] <== didHI[i];
    }

    /* Step 2: Create an encrypted token that contains (DID_I, DID_HI, DID_HV, DID_V) */
    component MessageEncrypt = MessageEncrypt(4*n256Bits*256);



}

/* public inputs:
 * - govPubKey: showing that the government is able to decrypt the token
   - symKeyXmXor: for government to obtain the symKey by `symKeyPointX XOR symKeyXmXor`
   - issuerPubKey: to convince verifier that the encrypted token contains the correct DID_I, DID_HI, which will be used to find the Issuer to retrieve the real identity of the Holding
   - didHV: for the verifier to make sure the token is generated by the Holder & prevent replay attack
   - didV: for the verifier to make sure the token is only for the Verifier & prevent replay attack
*/
component main {public[govPubKey, symKeyXmXor, issuerPubKey, didHV, didV]} = GenerateZkKYCToken(1);
