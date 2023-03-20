# Zero Knowledge Proof

## Operation
- build
- zkSNARK Setup (powers of tau)
- generate witness


# Implementation Details
## KeyGen: eddsa key process

## Baby Jubjub vs Ed25519
Some efforts have been made to incorporate the zkKYC token generation and signature verification process (the ZKP part of the project) with Hyperledger Aries, by implementing the encryption and digital signature schemes over the ed25519 curve. However, the currently existing circom implementation ed25519 [ref:https://github.com/Electron-Labs/ed25519-circom] is very inefficient and generates huge circuits, as it uses signal arrays to represent bits, such as `[0,1,0,1,0,0,1,1]`, instead of bigint words.
Therefore, we worked it around by using the mature and reliable Baby Jubjub curve circom implementation, which is still clear enough to demonstrate the concept of zkKYC, and publish the Baby Jubjub public keys along with the ed25519 public keys in the DID document.


## Message Representation

Representing an arbitrary message (as an integer) with a point on the BabyJub curve is tricky. 
An existing solution is pick a random point on the curve, and subtract the message from its x-coordinate [ref:https://ethresear.ch/t/elgamal-encryption-decryption-and-rerandomization-with-circom-support/8074] to get a `xIncrement` value. Then, the message can be represented by the point and `xIncrement`.

We improved this solution by performing XOR, instead of subtraction, between the lowest 253 bits of the x-coordinate and the message up to 253 bits, to get a `xmXor` value. Note that we do not utilize all 254 bits of the x-coordinate, because otherwise `xmXor` may overflow the BabyJub curve field size.

In the existing solution, we need to assert that the x-coordinate of the point is greater than the message, which can possibly fail, especially when the message integer is large. In our solution, the encoding can always succeed.

Also, our solution has an advantage that the representing point, which acts as the plaintext in the succeeding ElGamal encryption, can be _uniformly_ chosen at random, while the existing solution cannot as its x-coordinate is lower-bounded by the message. This advantage increases the security level of the entire encryption process.



pointX => 254-bit
symKey => 253-bit
limit => some 254-bit number
Therefore, to avoid overflow, we need to limit the number of iterations to 253. AKA xor they symKey with (pointX >> 1)


类比于 网络层协议
-- zkkyc
-- symmetric encryption 【symmetric header】【did payload】
-- asymmetric encryption【asymmetric header】【symmetric cipher payload】


- I used elgamal asymmetric encryption here. A better approach can be ECDH.
- Deploy the zkkyc verification to smart contract (Another paper: zkSNARKs in DeFi)

- production: babyjub points can be packed. to avoid unnecessary complications, we use the uncompressed form in this project

- EdDSA Private Key Processing (BabyJubJub edition)