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
    signal input aesKeyPoint[2]; // coordinates of aesKey babyjub encoding point
    signal input aesKeyXmXor;  // XOR of aesKey and the x-coordinate of aesKeyPoint
    signal input elGamalR;     // random number for ElGamal
    signal input aesIV[128];    // IV for AES-CTR encryption

    signal output aesKeyPointCipherC1[2];
    signal output aesKeyPointCipherC2[2];
    signal output encryptedToken[4*n248Bits*256+128];  // 4 n*248-bit DIDs + 128-bit AES-CTR IV


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
    // Compute the symmetric key by XORing the aesKey and aesKeyXmXor
    var aesKeyBits[256];
    component aesKeyPointXNum2Bits = Num2Bits(254);
    aesKeyPointXNum2Bits.in <== aesKeyPoint[0];
    component aesKeyXmXorNum2Bits = Num2Bits(253);
    aesKeyXmXorNum2Bits.in <== aesKeyXmXor;
    for (var i = 0; i < 253; i++) {
        var a, b;
        a = aesKeyPointXNum2Bits.out[i+1];  // the point x-coordinate is right-shifted by 1 bit during encoding to avoid XOR value overflow, so we do the same here as well
        b = aesKeyXmXorNum2Bits.out[i];
        aesKeyBits[i] = a + b - 2*a*b;  // XOR expressed in a quadratic equation
    }
    aesKeyBits[253] = 0;  // pad AES256 key with 0s
    aesKeyBits[254] = 0;  // pad AES256 key with 0s
    aesKeyBits[255] = 0;  // pad AES256 key with 0s
    
    // Convert DIDs int248 array to bits
    // Each 248-bit integer is converted into a __256-bit__ array of bits, tail padded with 0s
    // This is because AES expects the size to be "usize",
    // while the integers are 248-bit (31-byte), as limited by the order of the babyjub curve.
    component didINum2Bits[n248Bits];
    for (var i = 0; i < n248Bits; i++) {
        didINum2Bits[i] = Num2Bits(256);
        didINum2Bits[i].in <== didI[i];
    }
    component didHINum2Bits[n248Bits];
    for (var i = 0; i < n248Bits; i++) {
        didHINum2Bits[i] = Num2Bits(256);
        didHINum2Bits[i].in <== didHI[i];
    }
    component didHVNum2Bits[n248Bits];
    for (var i = 0; i < n248Bits; i++) {
        didHVNum2Bits[i] = Num2Bits(256);
        didHVNum2Bits[i].in <== didHV[i];
    }
    component didVNum2Bits[n248Bits];
    for (var i = 0; i < n248Bits; i++) {
        didVNum2Bits[i] = Num2Bits(256);
        didVNum2Bits[i].in <== didV[i];
    }

    // AES encryption
    component messageEncrypt = MessageEncrypt(4 * n248Bits * 256);  // Encrypt 4 n*248-bit DIDs, padded to a multiple of 256 bits
    for (var i = 0; i < n248Bits; i++) {
        for (var j = 0; j < 256; j++) {
            messageEncrypt.msg[i*256+j] <== didINum2Bits[i].out[j];
        }
    }
    for (var i = 0; i < n248Bits; i++) {
        for (var j = 0; j < 256; j++) {
            messageEncrypt.msg[(n248Bits+i)*256+j] <== didHINum2Bits[i].out[j];
        }
    }
    for (var i = 0; i < n248Bits; i++) {
        for (var j = 0; j < 256; j++) {
            messageEncrypt.msg[(2*n248Bits+i)*256+j] <== didHVNum2Bits[i].out[j];
        }
    }
    for (var i = 0; i < n248Bits; i++) {
        for (var j = 0; j < 256; j++) {
            messageEncrypt.msg[(3*n248Bits+i)*256+j] <== didVNum2Bits[i].out[j];
        }
    }
    messageEncrypt.key <== aesKeyBits;
    for (var i = 0; i < 128; i++) {
        messageEncrypt.ctr[i] <== aesIV[i];
    }
    encryptedToken <== messageEncrypt.ciphertext;

    component aesKeyEncrypt = ElGamalEncrypt();
    aesKeyEncrypt.mX <== aesKeyPoint[0];
    aesKeyEncrypt.mY <== aesKeyPoint[1];
    aesKeyEncrypt.pubKeyX <== govPubKey[0];
    aesKeyEncrypt.pubKeyY <== govPubKey[1];
    aesKeyEncrypt.r <== elGamalR;
    aesKeyPointCipherC1[0] <== aesKeyEncrypt.c1X;
    aesKeyPointCipherC1[1] <== aesKeyEncrypt.c1Y;
    aesKeyPointCipherC2[0] <== aesKeyEncrypt.c2X;
    aesKeyPointCipherC2[1] <== aesKeyEncrypt.c2Y;

}

/* public inputs:
 * - govPubKey: showing that the government is able to decrypt the token
   - aesKeyXmXor: for government to obtain the aesKey by `aesKeyPointX XOR aesKeyXmXor`
   - issuerPubKey: to convince verifier that the encrypted token contains the correct DID_I, DID_HI, which will be used to find the Issuer to retrieve the real identity of the Holding
   - didHV: for the verifier to make sure the token is generated by the Holder & prevent replay attack
   - didV: for the verifier to make sure the token is only for the Verifier & prevent replay attack
*/
component main {public[govPubKey, aesKeyXmXor, issuerPubKey, didHV, didV]} = GenerateZkKYCToken(1);
