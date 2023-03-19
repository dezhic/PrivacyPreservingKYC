



# Zero Knowledge Proof

## Operation
- build
- zkSNARK Setup (powers of tau)
- generate witness


# Implementation Details
KeyGen: eddsa key process

# Implementation Attempts

Some efforts have been made to incorporate the zkKYC token generation and signature verification process (the ZKP part of the project) with Hyperledger Aries, by implementing the encryption and 




Representing an arbitrary message with a point on the BabyJub curve is tricky. Similar work, xIncrement. Here, we propose an improved version XOR. More secure.

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

## Bit Lengths Used in the Project — 248, 253, 254 or 256?
You may have noticed that we use various bit lengths in the project. 
Those values are carefully chosen to maximize the security of the system, while avoiding overflow.
In this section, we will summarize bit lengths for the components and explain the rationale behind those choices.

Generally, signals in a Circom circuit should be bounded by the finite field that the underlying elliptic curve is defined on.
In our case, the _Baby Jubjub Elliptic Curve_ is defined over the field $F_p$, where $p$ is a _254-bit_ prime number [ref:https://eips.ethereum.org/EIPS/eip-2494].
Given this fact, we define the bit lengths for the following components in the project:

__DID Representation (248 bits):__ A DID is represented by an array of 248-bit unsigned integers. Each integer can be interpreted as a 31-byte string.

__AES Key (253 bits):__ We use a 253-bit key for AES-256 encryption, instead of the standard 256-bit key.
This is because this key will be encoded into a point on the Baby Jubjub curve and an XOR value as discussed in an earlier section.
Therefore, as the point coordinate is bounded by a 254-bit number, we need to limit the key size to 253 bits to avoid overflowing the XOR value.

__XOR Value (253 bits):__ The XOR value, named `xmXor`, is used to encode the AES key into a point on the Baby Jubjub curve. It is the result of XORing the 253-bit AES key with the lowest 253 bits of the x-coordinate of the encoding point `aesKeyPoint`.

__ElGamal random value `r` (253 bits):__ The random value `r` is a signal in the ElGamal encryption circuit. Signals are bounded by a 254-bit number. When generating the `r`, however, we use a 253-bit random number to avoid overflowing the signal.

__Baby Jubjub Point (254 bits):__ A point on the Baby Jubjub curve is represented by two 254-bit unsigned integers or buffers.
Public keys, `R` in the EdDSA signature, the encoding point `aesKeyPoint`, "shared secret" `s` in ElGamal encryption, and the `c1` and `c2` of the ElGamal ciphertext are all Baby Jubjub points.

__Private Key (256 bits):__ We use a 32-byte buffer as the private key for the EdDSA signature.
Internally, EdDSA derives a 253-bit scalar from the private key, which is used for the signature generation process.

__Private Key Scalar (253 bits):__ A 253-bit scalar derived according to the Baby Jubjub EdDSA signature scheme. It is also used as the private key for the ElGamal decryption.

__AES Circuit Input (256 bits):__ As the AES-256 algorithm requires the size of the input to be the multiple of the unsigned integer size, we pad input units (integers representing DIDs) to 256 bits with trailing zeros.
The 253-bit AES key is also padded to 256 bits with trailing zeros before inputting into the AES circuit.

# Appendix
## Project Code Navigation
### Circom & SnarkJS
#### Circuits
#### Services
#### API
#### Scripts

### Hyperledger Aries
