



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

## Bit Lengths Used in the Project — 248, 253, 254 or 256?
You may have noticed that we use different bit lengths in the project. 


# Appendix
## Project Code Navigation
### Circom & SnarkJS
#### Circuits
#### Services
#### API
#### Scripts

### Hyperledger Aries
