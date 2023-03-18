pragma circom 2.0.0;

include "../aes-circom-circuits/aes_256_ctr.circom";
include "../aes-circom-circuits/aes_256_key_expansion.circom";

template MessageEncrypt(nBits) {
    
    signal input msg[nBits];
    signal input key[256];
    signal input ctr[128];
    signal output ciphertext[nBits+128];

    // Encrypt message with aesKey using AES
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
