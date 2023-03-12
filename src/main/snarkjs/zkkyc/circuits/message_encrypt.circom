pragma circom 2.0.0;

include "../node_modules/@electron-labs/aes-gcm-siv-circom/circuits/aes_256_ctr.circom";
include "../node_modules/@electron-labs/aes-gcm-siv-circom/circuits/aes_256_key_expansion.circom";

/*
    This circuit takes
    - any message
    - a random key for symmetric encryption
    - a public key for asymmetric encryption
    and outputs
    - the public-key encrypted symmetric key
    - the symetric-key encrypted message
*/
template MessageEncrypt(nBits) {
    // signal input pubKey;     // 256-bit int, Government's public key, used for asymmetrically encrypt symKey
    // signal input symKey;     // 256-bit int, a random symmetric key, used for symmetrically encrypt message
    // signal input didI[]

    // signal output keyCipher;      // encrypted symKey
    // signal output messageCipher;  // encrypted message
    
    // // component aes
    // // use aes to encrypt message with symKey

    
    // // component num2bits/bits2point
    // // convert symKey to bits, then to point
    
    // // component babyjub-encrypt
    // // use babyjub-encrypt to encrypt symKeyHash with pubKey

    /* Step 2.1 Encrypt (issuedCred, DID_HV, DID_V) with symKey using AES */
    // compute symKey by `symKeyPointX XOR symKeyXmXor`
    /* Step 2.2 Encrypt symKeyPointX using ElGamal encryption */
    
    signal input msg[nBits];
    signal input key[256];
    signal input ctr[128];
    signal output ciphertext[nBits+128];

    // Encrypt message with symKey using AES
    component keyExp = AES256KeyExpansion();
    for (var i=0; i<256; i++) {
        keyExp.key[i] <== key[i];
    }
    component aes256ctr = AES256CTR(nBits);
    for (var i=0; i<nBits; i++) {
        aes256ctr.in[i] <== msg[i];
    }
    for (var i=0; i<128; i++) {
        aes256ctr.ctr[i] <== ctr[i];
    }
    for (var i=0; i<1920; i++) {
        aes256ctr.ks[i] <== keyExp.w[i];
    }
    for (var i=0; i<nBits; i++) {
        ciphertext[i] <== aes256ctr.out[i];
    }
    for (var i=0; i<128; i++) {
        ciphertext[nBits+i] <== ctr[i];
    }
}

// component main = MessageEncrypt(1024);
