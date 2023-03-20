# The zkKYC Solution Concept

# System Overview


# Self-Sovereign Identity (SSI) Using Hyperledger Aries

# Zero Knowledge Proof (ZKP) with zk-SNARKs

## zk-SNARK Fundamentals
### What are zk-SNARKs?
___TODO: FROM MID-TERM REPORT___
### Choosing a Proving System – Groth16 or PLONK?

### Implementing zk-SNARKs in the Project
We can define zk-SNARK constraints in the form of a circuit using the circom language, and then generate the witness and proof using SnarkJS.

build ... setup --> ... phase 2 ... -> **verification key** (referred later)

## ZKP Workflow for zkKYC
In this section, we will illustrate the zero knowledge proof workflow using the following scenario:

- Issuer has a public DID `did_i` and has a key pair (`pub_i`, `priv_i`).
- Holder generates a peer DID `did_hi` to interact with Issuer.
- Verifier has a public DID `did_v`.
- Holder generates a peer DID `did_hv` to interact with Verifier.
- Government has a key pair (`pub_g`, `priv_g`).

Before the zkKYC process, the Holder has already registered with the Issuer. That is to say, the Issuer has the binding `{ did: "did_hi", real_name: "Evil Holder", passport_no: "A12345678" }` in its database.
 

__1. Issuer signs the tuple `(did_i, did_hi)`.__

When the Holder requests a KYC credential, the Issuer signs the tuple `(did_i, did_hi)` with its private key `priv_i`, and sends the signature `sig_i_hi` to the Holder in the credential.
This conveys that the Holder is a recognized customer of the Issuer.

__2. Holder generates the zkKYC token and proof for the Verifier.__

When the Holder registers a business with the Verifier, the Holder generates a zkKYC token and proof for the specific Verifier.

To generate the zkKYC token, the Holder inputs `did_i`, `did_hi`, `did_hv`, `did_v`, `sig_i_hi`, `pub_i`, `pub_g` into the zkKYC token generation circuit. The circuit will perform the following steps:

- Verify `(did_i, did_hi)` with `pub_i` and `sig_i_hi`.
- Encrypt `(did_i, did_hi, did_hv, did_v)` with `pub_g` to obtain the _circuit output_, `encryptedToken`.
- Include `did_hv`, `did_v`, `pub_i` and `pub_g` as _public inputs_.
- Generate a _proof_ for the public inputs and the circuit output.

Then, the Holder sends public inputs, output and proof to the Verifier. These can be regarded as the zkKYC token and proof.

__3. Verifier verifies the zkKYC token and proof.__

When the Verifier receives the information from the Holder, it checks the following:

- Verify the public inputs and output with the proof using the verification key of the circuit, to ensure the enclosed information is valid.
- Check the public inputs `did_hv` and `did_v` to ensure that the zkKYC token is intended for the Verifier.
- Check the public input `pub_i` to ensure that the Holder is registered with a _recognized_ Issuer.
- Check the public input `pub_g` to ensure that the `encryptedToken` can be decrypted by the intended Government.

__4. Government decrypts the zkKYC token.__

When the Verifier spots suspicious activities of the Holder identified by `did_hv`, the Verifier reports the `encryptedToken` to the Government for further investigation.

Government decrypts the `encryptedToken` with its private key `priv_g`, and obtains the tuple `(did_i, did_hi, did_hv, did_v)`. Then, Government can 
- check that this is the zkKYC token of the suspicious Holder `did_hv` doing business with the reporting Verifier `did_v`, and
- contact the Issuer `did_i` to obtain the Holder's real identity with `did_hi`.

Finally, Issuer can retrieve the Holder's real identity, `{ real_name: "Evil Holder", passport_no: "A12345678" }`, for the Government to take further actions.

## Implementation Details
Now, we are clear about the workflow of the zkKYC process. In this section, we will discuss the implementation details of the workflow.
### Signing and Verification with EdDSA
The signing and verification of the tuple `(did_i, did_hi)` is done using EdDSA over the Baby Jubjub curve.

In practice, the signature is created on the _Poseidon Hash_ of the encoded `did_i` and `did_hi` concatenated together. We have chosen the Poseidon hash function in favor of the well-known SHA-256 hash function, because the Poseidon hash function is a set of permutations over a prime field, which makes it more efficient for zk-SNARKs.

In contrast, the SHA-256 hash function is inefficient in our use case, and it also resulted in a large number of constraints in the circuits according to our experiments.

EdDSA Signing is performed in NodeJS using the _@iden3/js-crypto_ library, and verification is performed in the circuit using the _circomlib_ library.

### Encryption and Decryption with ElGamal and AES

### Key Generation
__Asymmetric Key Pair__


__Symmetric Key__



### Message Representation in ElGamal Encryption

### zkKYC Token Structure

### Bit Lengths of Components — 248, 253, 254 or 256?
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
Finally, let us review the requirements of the zkKYC solution concept and see how the project meets those requirements.

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
