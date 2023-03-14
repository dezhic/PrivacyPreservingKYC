pragma circom 2.0.0;

include "./verify_eddsa.circom";
include "./message_encrypt.circom";
include "./babyjub-encrypt.circom";
include "../node_modules/circomlib/circuits/gates.circom";

/*
 * - __DID encoding__:
 *   A DID is encoded into chunks of __bytes__ of length (n248Bits * 31)
 *   Then convert each 31-byte chunk into a 248-bit bigint (little endian)
 *   Finally, represent a DID as an array of 248-bit bigints
 * 
 * @param n248Bits: number of 248-bit bigints to represent a DID
 */
template GenerateZkKYCToken(n248Bits) {
    signal input didI[n248Bits];
    signal input didHI[n248Bits];
    signal input didHV[n248Bits];
    signal input didV[n248Bits];
    signal input sigS;      // Issuer's signature on poseidonHash(concat(didI,didHI)) (S part of EdDSA signature)
    signal input sigR[2];   // Issuer's signature on poseidonHash(concat(didI,didHI)) (R part of EdDSA signature)
    signal input issuerPubKey[2];  // Issuer's public key for signature verification

    signal input govPubKey[2];  // Government's public key for encryption

    // Encryption parameters
    signal input symKeyPointX; // x-coordinate of symKey babyjub encoding point
    signal input symKeyXmXor;  // XOR of symKey and the x-coordinate of symKeyPoint
    signal input elGamalR;     // random number for ElGamal
    signal input aesIV[128];    // IV for AES-CTR encryption

    signal output keyCipherC1[2];
    signal output keyCipherC2[2];
    signal output symCipher[4*n248Bits*248+128];  // 4 n*248-bit DIDs + 128-bit AES-CTR IV

    /* Step 1: Verify Issuer's signature on DID_I, DID_HI */
    component verifyEdDSA = VerifyEdDSA(2*n248Bits);
    verifyEdDSA.pubKey[0] <== issuerPubKey[0];
    verifyEdDSA.pubKey[1] <== issuerPubKey[1];
    verifyEdDSA.S <== sigS;
    verifyEdDSA.R[0] <== sigR[0];
    verifyEdDSA.R[1] <== sigR[1];
    for (var i = 0; i < n248Bits; i++) {
        verifyEdDSA.msg[i] <== didI[i];
    }
    for (var i = 0; i < n248Bits; i++) {
        verifyEdDSA.msg[n248Bits + i] <== didHI[i];
    }

    /* Step 2: Create an encrypted token that contains (DID_I, DID_HI, DID_HV, DID_V) */
    // Compute the symmetric key by XORing the symKey and symKeyXmXor
    var symKeyBits[256];
    component symKeyPointXNum2Bits = Num2Bits(248);
    symKeyPointXNum2Bits.in <== symKeyPointX;
    component symKeyXmXorNum2Bits = Num2Bits(248);
    symKeyXmXorNum2Bits.in <== symKeyXmXor;
    for (var i = 0; i < 248; i++) {
        var a, b;
        a = symKeyPointXNum2Bits.out[i];
        b = symKeyXmXorNum2Bits.out[i];
        symKeyBits[i] = a + b - 2*a*b;  // XOR expressed in a quadratic equation
    }
    for (var i = 248; i < 256; i++) {
        symKeyBits[i] = 0;  // pad AES256 key with 0s
    }
    
    // Debug
    component debugBits2Num = Bits2Num(256);
    debugBits2Num.in <== symKeyBits;
    var symKey = debugBits2Num.out;
    log("symKeyPointX: ", symKeyPointX);
    log("symKeyXmXor: ", symKeyXmXor);
    log("symKey: ", symKey);
    // End Debug
    
    // Convert DIDs int248 array to bits
    component didINum2Bits[n248Bits];
    for (var i = 0; i < n248Bits; i++) {
        didINum2Bits[i] = Num2Bits(248);
        didINum2Bits[i].in <== didI[i];
    }
    component didHINum2Bits[n248Bits];
    for (var i = 0; i < n248Bits; i++) {
        didHINum2Bits[i] = Num2Bits(248);
        didHINum2Bits[i].in <== didHI[i];
    }
    component didHVNum2Bits[n248Bits];
    for (var i = 0; i < n248Bits; i++) {
        didHVNum2Bits[i] = Num2Bits(248);
        didHVNum2Bits[i].in <== didHV[i];
    }
    component didVNum2Bits[n248Bits];
    for (var i = 0; i < n248Bits; i++) {
        didVNum2Bits[i] = Num2Bits(248);
        didVNum2Bits[i].in <== didV[i];
    }

    // AES encryption
    component messageEncrypt = MessageEncrypt(4*n248Bits*248);  // Encrypt 4 n*248-bit DIDs
    for (var i = 0; i < n248Bits; i++) {
        for (var j = 0; j < 248; j++) {
            messageEncrypt.msg[i*248+j] <== didINum2Bits[i].out[j];
        }
    }
    for (var i = 0; i < n248Bits; i++) {
        for (var j = 0; j < 248; j++) {
            messageEncrypt.msg[(n248Bits+i)*248+j] <== didHINum2Bits[i].out[j];
        }
    }
    for (var i = 0; i < n248Bits; i++) {
        for (var j = 0; j < 248; j++) {
            messageEncrypt.msg[(2*n248Bits+i)*248+j] <== didHVNum2Bits[i].out[j];
        }
    }
    for (var i = 0; i < n248Bits; i++) {
        for (var j = 0; j < 248; j++) {
            messageEncrypt.msg[(3*n248Bits+i)*248+j] <== didVNum2Bits[i].out[j];
        }
    }
    messageEncrypt.key <== symKeyBits;
    for (var i = 0; i < 128; i++) {
        messageEncrypt.ctr[i] <== aesIV[i];
    }
    symCipher <== messageEncrypt.ciphertext;

    component symKeyEncrypt = ElGamalEncrypt();
    symKeyEncrypt.m <== symKeyPointX;
    symKeyEncrypt.pubKey <== govPubKey[1];
    symKeyEncrypt.r <== elGamalR;
    keyCipherC1[0] <== symKeyEncrypt.c1X;
    keyCipherC1[1] <== symKeyEncrypt.c1Y;
    keyCipherC2[0] <== symKeyEncrypt.c2X;
    keyCipherC2[1] <== symKeyEncrypt.c2Y;

    // log("didI", didI);
    // log("didHI", didHI);
    log("didHV[0]", didHV[0]);
    log("did[0]", didV[0]);
    // log("sigS", sigS);
    // log("sigR[0]", sigR[0]);
    // log("sigR[1]", sigR[1]);
    log("issuerPubKey[0]", issuerPubKey[0]);
    log("issuerPubKey[1]", issuerPubKey[1]);
    log("govPubKey[0]", govPubKey[0]);
    log("govPubKey[1]", govPubKey[1]);
    log("symKeyXmXor", symKeyXmXor);
    log("keyCipherC1[0]", keyCipherC1[0]);
    log("keyCipherC1[1]", keyCipherC1[1]);
    log("keyCipherC2[0]", keyCipherC2[0]);
    log("keyCipherC2[1]", keyCipherC2[1]);

}

/* public inputs:
 * - govPubKey: showing that the government is able to decrypt the token
   - symKeyXmXor: for government to obtain the symKey by `symKeyPointX XOR symKeyXmXor`
   - issuerPubKey: to convince verifier that the encrypted token contains the correct DID_I, DID_HI, which will be used to find the Issuer to retrieve the real identity of the Holding
   - didHV: for the verifier to make sure the token is generated by the Holder & prevent replay attack
   - didV: for the verifier to make sure the token is only for the Verifier & prevent replay attack
*/
component main {public[govPubKey, symKeyXmXor, issuerPubKey, didHV, didV]} = GenerateZkKYCToken(1);
