pragma circom 2.0.0;

include "./verify_eddsa.circom";
include "./message_encrypt.circom";
include "./babyjub-encrypt.circom";
include "../node_modules/circomlib/circuits/gates.circom";

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
    signal input symKeyPointX; // x-coordinate of symKey babyjub encoding point
    signal input symKeyXmXor;  // XOR of symKey and the x-coordinate of symKeyPoint
    signal input elGamalR;     // random number for ElGamal
    signal input aesIV[128];    // IV for AES-CTR encryption

    signal output keyCipherC1[2];
    signal output keyCipherC2[2];
    signal output symCipher[4*n256Bits*256+128];  // 4 n*256-bit DIDs + 128-bit AES-CTR IV

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
        verifyEdDSA.msg[n256Bits + i] <== didHI[i];
    }

    /* Step 2: Create an encrypted token that contains (DID_I, DID_HI, DID_HV, DID_V) */
    // Compute the symmetric key by XORing the symKey and symKeyXmXor
    var symKeyBits[256];
    component symKeyPointXNum2Bits = Num2Bits(256);
    symKeyPointXNum2Bits.in <== symKeyPointX;
    component symKeyXmXorNum2Bits = Num2Bits(256);
    symKeyXmXorNum2Bits.in <== symKeyXmXor;
    for (var i = 0; i < 256; i++) {
        var a, b;
        a = symKeyPointXNum2Bits.out[i];
        b = symKeyXmXorNum2Bits.out[i];
        symKeyBits[i] = a + b - 2*a*b;  // XOR expressed in a quadratic equation
    }
    
    // Debug
    component debugBits2Num = Bits2Num(256);
    debugBits2Num.in <== symKeyBits;
    var symKey = debugBits2Num.out;
    log("symKeyPointX: ", symKeyPointX);
    log("symKeyXmXor: ", symKeyXmXor);
    log("symKey: ", symKey);
    // End Debug
    
    // Convert DIDs int256 array to bits
    component didINum2Bits[n256Bits];
    for (var i = 0; i < n256Bits; i++) {
        didINum2Bits[i] = Num2Bits(256);
        didINum2Bits[i].in <== didI[i];
    }
    component didHINum2Bits[n256Bits];
    for (var i = 0; i < n256Bits; i++) {
        didHINum2Bits[i] = Num2Bits(256);
        didHINum2Bits[i].in <== didHI[i];
    }
    component didHVNum2Bits[n256Bits];
    for (var i = 0; i < n256Bits; i++) {
        didHVNum2Bits[i] = Num2Bits(256);
        didHVNum2Bits[i].in <== didHV[i];
    }
    component didVNum2Bits[n256Bits];
    for (var i = 0; i < n256Bits; i++) {
        didVNum2Bits[i] = Num2Bits(256);
        didVNum2Bits[i].in <== didV[i];
    }

    // AES encryption
    component messageEncrypt = MessageEncrypt(4*n256Bits*256);
    for (var i = 0; i < n256Bits; i++) {
        for (var j = 0; j < 256; j++) {
            messageEncrypt.msg[i*256+j] <== didINum2Bits[i].out[j];
        }
    }
    for (var i = 0; i < n256Bits; i++) {
        for (var j = 0; j < 256; j++) {
            messageEncrypt.msg[(n256Bits+i)*256+j] <== didHINum2Bits[i].out[j];
        }
    }
    for (var i = 0; i < n256Bits; i++) {
        for (var j = 0; j < 256; j++) {
            messageEncrypt.msg[(2*n256Bits+i)*256+j] <== didHVNum2Bits[i].out[j];
        }
    }
    for (var i = 0; i < n256Bits; i++) {
        for (var j = 0; j < 256; j++) {
            messageEncrypt.msg[(3*n256Bits+i)*256+j] <== didVNum2Bits[i].out[j];
        }
    }
    messageEncrypt.key <== symKeyBits;
    for (var i = 0; i < 128; i++) {
        messageEncrypt.ctr[i] <== aesIV[i];
    }
    symCipher <== messageEncrypt.ciphertext;

    component symKeyEncrypt = ElGamalEncrypt();
    symKeyEncrypt.m <== symKeyPointX;
    symKeyEncrypt.pubKey <== govPubKey;
    symKeyEncrypt.r <== elGamalR;
    keyCipherC1[0] <== symKeyEncrypt.c1X;
    keyCipherC1[1] <== symKeyEncrypt.c1Y;
    keyCipherC2[0] <== symKeyEncrypt.c2X;
    keyCipherC2[1] <== symKeyEncrypt.c2Y;

}

/* public inputs:
 * - govPubKey: showing that the government is able to decrypt the token
   - symKeyXmXor: for government to obtain the symKey by `symKeyPointX XOR symKeyXmXor`
   - issuerPubKey: to convince verifier that the encrypted token contains the correct DID_I, DID_HI, which will be used to find the Issuer to retrieve the real identity of the Holding
   - didHV: for the verifier to make sure the token is generated by the Holder & prevent replay attack
   - didV: for the verifier to make sure the token is only for the Verifier & prevent replay attack
*/
component main {public[govPubKey, symKeyXmXor, issuerPubKey, didHV, didV]} = GenerateZkKYCToken(1);
