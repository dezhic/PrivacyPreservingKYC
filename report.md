# The zkKYC Solution Concept

# System Overview


# Self-Sovereign Identity (SSI) Using Hyperledger Aries

# Zero Knowledge Proof (ZKP) with zk-SNARKs

## zk-SNARK Fundamentals
### What are zk-SNARKs?

### Choosing a Proving System – Groth16 or PLONK?

### Implementing zk-SNARKs in the Project
Thanks to Circom and SnarkJS, we define zk-SNARK constraints in the form of a circuit using the circom language, and then generate the witness and proof using SnarkJS.

## ZKP Workflow for zkKYC

## Implementation Details
### Circuits
__Asymmetric Encryption__

__Symmetric Encryption__: AES-256-CTR

### Bit Lengths Used in the Project — 248, 253, 254 or 256?
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

# Requirements Review
Now, we will review the requirements of the zkKYC solution concept and see how the project meets those requirements.

__No correlating signatures__

This is achieved by including the signature verification process in the ZKP circuit.

# Future Work
__Optimize Implementation__ &nbsp; For simplicity, we did not consider the performance and efficiency of the implementation in this project.
We can identify several areas for optimization:

- Compared to ElGamal encryption, ECDH is more efficient and secure. We can use ECDH to derive the shared secret for symmetrically encrypting the DIDs payload.
- AES-256 encryption results in large circuits. For instance, our circuit uses the plain AES-256-CTR circuit to encrypt just 32 bytes of data, but has more than 120,000 constraints and generates a 21.7MB R1CS file! We should find some _zk-friendly_ alternatives for token symmetric encryption.
- For clearer demonstrations, we used the uncompressed form of Baby Jubjub points in the project (two 254-bit integers). In practice, we can pack a point into one single 255-bit integer to improve efficiency.

__Reconsider Proving Systems__ &nbsp; We use the Groth16 proving system in this project. However, we may want to consider other proving systems in practice, because Groth16 requires a trusted setup for each circuit.
A trusted setup usually involves multiple trusted parties to guarantee the security of the setup. It may not be practical to go through such a process for each circuit.

__Integrate into DeFi Protocols__ &nbsp; This could be the most exciting potential of the project, and has also been discussed in the succeeding zkKYC paper – _zkKYC in DeFi_ [ref:https://eprint.iacr.org/2022/321]. This project can be easily extended to integrate with DeFi protocols, as Circom can generate Solidity smart contracts for proof verification. Then, a DeFi protocol can include the zkKYC verification process in its smart contract, and require users to submit a valid zkKYC proof before they can use the protocol. This will enable DeFi protocols to provide a more trustful and still privacy-preserving service to authenticated users.

# Appendix
## Project Setup
## Project Code Navigation
### Circom & SnarkJS
#### Circuits
#### Services
#### API
#### Scripts

### Hyperledger Aries
