Privacy-Preserving KYC
# Abstract
Know-Your-Customer (KYC) process is a critical step in some businesses to combat crime. Several problems exist in traditional KYC process and they may threaten users' privacy. A solution concept named _zkKYC_ is proposed to address these problems. The solution concept specifies the business requirements for a privacy-preserving KYC system. This project aims to address the challenge in the designing a zero-knowledge KYC token generation and verification mechanism, and provide an implementation a privacy-preserving KYC system based on the zkKYC solution concept using Self-Sovereign Identity (SSI) and zero-knowledge proofs.

# Introduction

# Problem and Objective
Generally speaking, we have the following problems in the current traditional KYC process:
-	Traditional businesses collect much information for the KYC purpose and clients have poor control over the shared information
-	Crypto businesses guarantee privacy and anonymity but lack the KYC process to combat crime

According to Pauwels (2021), the traditional KYC process has the following problems that threaten the security of users’ personal information:

> __Copy Problem:__ When users have to share personal information with each regulated entity that they engage with, it is impossible for them to control what these businesses subsequently do with that information. It can be copied, sold, misused, or may indeed be part of a hack or data breach anytime in the future. \
> __Bundling Problem:__ While AML/CTF regulations usually require only specific data attributes (e.g. name, address, date of birth) of a customer to be verified for KYC purposes, often much more personal data is collected and stored by the regulated entity. \
> __Recursive Oversight Problem:__ When users have to share personal information with a regulated entity, what governance protections do they have for their information? If data protection regulation does exist in a particular jurisdiction (e.g. GDPR), how is this enforced? How is the regulated entity held accountable for violating data governance obligations? If a regulated entity shares customer identity data with a regulator or other government agency, what privacy protection obligations are they subject to and who holds them to account?

To address these problems, Pauwels (2021) proposed a solution concept named __*zkKYC*__, which leverages Self-Sovereign Identity (SSI) and zero-knowledge proofs to achieve the KYC purpose without disclosing any personal information.

While Pauwels (2021) gives comprehensive business requirements and the solution concept, challenges lie in the implementation of the zero-knowledge proving system (Pauwels et al., 2022).

Therefore, the objective of this project is to study existing SSI technologies, design a zero-knowledge proving mechanism and finally provide an implementation of the zkKYC solution concept.

# The zkKYC Solution Concept

## Business Requirements
Here are the business requirements of the privacy-preserving KYC system specified in the original zkKYC paper:

> | ID   | Business Requirement |
> | ---- | -------------------- |
> | BR01 | The level of user control, agency and privacy provided and enabled by the self-sovereign identity model MUST be preserved or enhanced. See section 3.2 for details. |
> | BR02 | A User SHOULD NOT share personal identifiable information (e.g. name, address, date of birth) when on-boarding at a Business. |
> | BR03 | A User MUST prove they meet the criteria defined by the Business or relevant regulator(s) to consume the provided service (e.g. adult, domestic resident, valid driver license for specific vehicle category, verified email address). |
> | BR04 | A Business that suspects a specific User of fraud, money laundering or terrorism financing MUST be able to report that User to Government (e.g. regulator). |
> | BR05 | A Business that wants to file charges against a specific User due to breach of contract or other dispute MUST be able to report that User to Government (e.g. law enforcement). |
> | BR06 | Government (e.g. regulator, law enforcement) MUST be able to identify a reported User based on the information provided and on the ground of reasonable suspicion. |
> | BR07 | When a Business reports a User to Government, this MUST NOT be disclosed to the User (i.e. tipping-off). |
> | BR08 | A Business SHOULD NOT hold personal identifiable information on a User, unless it is provided to them by Government in context of a reported issue. |

# System Overview
[TODO]: An overview of the system; Briefly mention that we will use Aries to implement the SSI framework and zk-SNARKs to achieve the zkKYC token generation and verification.

# Self-Sovereign Identity (SSI) Using Hyperledger Aries
## What is Self-Sovereign Identity?

## Key Components in SSI
### Decentralized Identifier (DID)

### Verifier Credential

### Verifiable Data Registry

## Hyperledger's SSI Framework


## Implementing zkKYC with Hyperledger Aries
___TODOOOOOOOOOOOOOOOOOOOOOO!!!!!!!___


# Zero Knowledge Proof (ZKP) with zk-SNARKs
Generating the _zkKYC token_ and the _validity proof_ is an unaddressed challenge in the zkKYC paper.
In this section, we will discuss our approach to solving this problem using zero knowledge proof with _zk-SNARKs_.

## zk-SNARK Fundamentals
In this section, we will introduce the fundamentals of zk-SNARKs, and how we can implement zk-SNARKs in our project.

### What are zk-SNARKs?
_zk-SNARKs_ stands for _Zero Knowledge Succinct Non-interactive ARgument of Knowledge_. It is a type of zero knowledge proof that allows a prover to convince a verifier that a statement is true, without revealing any information beyond the statement itself. The statement is usually a mathematical expression, and the prover can prove that the statement is true by providing a _witness_ that satisfies the statement.

There are many zk-SNARK schemes, or proving systems. To understand how zk-SNARKs achieve zero knowledge proof, we will use a polynomial-based proving system as an example to demonstrate the mechanism. [ref:Why and How zk-SNARK Works]

__Knowledge as Polynomial__

There is an advantageous property of polynomials. Two non-equal
polynomials of degree at most $d$ can intersect at no more than $d$
points. So, when an $x$ is randomly chosen from $N$ numbers, the
probability of choosing an intersecting point is $\frac{d}{N}$, which is
negligible when $N$ is significantly larger than $d$.

Therefore, if the prover responds with a correct evaluation of the
polynomial when given a random position $x$, it is highly confident that
the prover does know the coefficients of the polynomial.

Thanks to this property, we can express knowledge as coefficients of a
polynomial, and easily prove that we know the coefficients.

__Factorization__

There are usually some constraints on the knowledge (polynomial) that
the prover claims to know. For example, the prover claims that he knows
a polynomial of degree $d$,

$p(x) = c_{0}x^{0} + c_{1}x^{1} + \ldots + c_{d}x^{d}$,

and it has roots $x = 1\ $and $x = 2$.

Factorization can help us extract these constraints. In the above
example, because *p(x)* has roots $x = 1\ $ and $x = 2$., we know that
*p(x)* can be factorized into

$p(x)\  = \ t(x)\ h(x)$*,*

where $t(x) = (x - 1)(x - 2)$ and is called the *target polynomial*, and
$h(x)$ is the quotient of $p(x)\text{/}t(x)$.

So far, the prover and the verifier can try proving in the following
protocol:

-   Verifier chooses a random number $s$, and computes $t_{s} = t(s)$.
    Then, Verifier passes $s$ to Prover

-   Prover obtains $h(x) = \frac{p(x)}{t(x)}$ and computes
    $p_{s} = p(s)$ and $h_{s} = h(s)$. Then, Prover passes $p_{s}$ and
    $h_{s}$ to Verifier

-   Verifier verifies $p_{s} = t_{s} \cdot h_{s}$

However, the proof is valid only if both Verifier and Prover honestly
follow this protocol. The prover can easily cheat by first choosing an
arbitrary value as $h_{s}$, and then obtain an $p_{s}$ by multiply the
arbitrary $h_{s}$ by $t_{s}$.

__Homomorphic Encryption__

The flaw of the above protocol is caused by passing a plaintext $s$ for
polynomial evaluation, allowing dishonest provers to fabricate an
equation. This problem can be solved by homomorphic encryption.

A simple homomorphic encryption is

$E(x) = g^{x}\ \ \ (mod\ n)$,

where $g$ is a natural number base, and $mod\ n$ makes it difficult to
solve $y = E(x)$ for $x$, due to the high complexity of the discrete
logarithm problem.

Here are two operations supported by $E(x)$:

-   Addition of two encrypted values $a$ and $b$:

> $$g^{a + b} = g^{a} \cdot g^{b} = E(a) \cdot E(b)$$

-   Multiplication of an encrypted value $a$ by an unencrypted value
    $m$:

> $$\left( g^{a}m \right) = \left( g^{a} \right)^{m} = \left( E(a) \right)^{m}$$

Now, we can encrypt the random value $s$ chosen by Verifier before
passing to Prover. As $E(x)$ does not support exponential operation
encrypted values, the verifier needs to prepare encrypted values of
$s^{0},s^{1},\ldots,s^{d}$. The original protocol can be updated as
follows:

-   Verifier chooses a random number $s$, and computes $t_{s} = t(s)$.

-   Verifier computes $E_{s^{i}} = E\left( s^{i} \right)$ for $i$ in
    $0,\ 1,\ \ldots,\ d$ and passes $E_{s^{i}}$ to Prover

-   Prover obtains $h(x) = \frac{p(x)}{t(x)}$

-   Prover computes
    $E_{p_{s}} = E\left( p(s) \right) = g^{p(s)} = g^{c_{0}s^{0} + c_{1}s^{1} + \ldots + c_{d}s^{d}}$

$$= \left( g^{s^{0}} \right)^{c_{0}} \cdot \left( g^{s^{1}} \right)^{c_{1}} \cdot \ldots \cdot \left( g^{s^{d}} \right)^{c_{d}} = \prod_{i = 0}^{d}\left( E_{s^{i}} \right)^{c_{i}}$$

-   Prover computes $E_{h_{s}}$ in a similar way

-   Prover passes $E_{p_{s}}$ and $E_{h_{s}}$ to Verifier

-   Verifier verifies
    $E_{p_{s}} = \left( E_{h_{s}} \right)^{t_{s}}\mathbf{\ \  \Rightarrow \ \ }g^{p(s)} = \left( g^{h(s)} \right)^{t(s)}\mathbf{\ \  \Rightarrow \ \ }p(s) = h(s)\ t(s)$

This updated protocol prevents the prover from getting plaintext $s$ and
directly computing $t(s)$. However, this does not completely eliminate
the possibility of cheating. Prover can still fabricate an equation as
follows:

-   Compute $g^{t(s)}$ using $E_{s^{i}}$

-   Find a random value $r$, let $z_{h} = g^{r}$,
    $z_{p} = \left( g^{t(s)} \right)^{r}$, so that
    $z_{p} = z_{h}^{t(s)}$

-   Now, $E_{p_{s}}$ and $E_{h_{s}}$ can be forged by $z_{p}$ and
    $z_{h}$ respectively

__Knowledge-of-Exponent Assumption (KEA)__

To address the problem above, we need to enforce the prover to obtain
the values via the polynomials $p(x)$ and $h(x)$. Note that after
applying the homomorphic encryption, the coefficients of polynomials are
used to *exponentiate* the encrypted values $E_{s_{i}}$. That is why KEA
can help.

The problem KEA addresses is described as follows:

Alice has a value $a$. She needs to pass $a$ to Bob and asks Bob to
perform an exponentiation $a^{v}$, where the exponent $v$ is *only known
by Bob*. How can Alice ensure that Bob has performed the exponentiation
for $a$ with some $v$, instead of returning some other values?

The solution is to prepare a *shifted* value
$a^{'} = a^{\alpha}\ \ \ mod\ n$, where $\alpha$ is chosen and only
known by Alice. Then, Alice passes $a^{'}$ along with $a$, and asks Bob
to perform the same exponential operation on $a$, $a^{'}$ to obtain $b$,
$b^{'}$. Finally, Alice checks if

$$b^{\alpha} = \left( a^{v} \right)^{\alpha} = a^{\alpha v} = a^{'v} = b^{'}$$

Since Bob cannot obtain $\alpha$ except by unfeasible brute-forcing, the
only way for Bob to produce $\left( b,b^{'} \right)$ that satisfies the
above equation is to perform the exponentiation.

Therefore, in addition to steps in the previous protocol, Verifier will
prepare shifted values $E_{s^{i}}^{'} = g^{\alpha s^{i}}$ to be passed
to Prover along with $E_{s^{i}}$, and Prover will return $E_{p_{s}}$ and
$E_{p_{s}}^{'}$. Finally, if Verifier checks that if
$\left( E_{p_{s}} \right)^{\alpha} = E_{p_{s}}^{'}$, it proves that the
prover has correctly performed the homomorphic-encrypted calculation.

__Achieving Zero-Knowledge__

So far, we have achieved sound and complete proving. But values passed
from Prover to Verifier, $E_{p_{s}} = g^{p(s)}$, $E_{h_{s}} = g^{h(s)}$
and $E_{p_{s}}^{'} = g^{\alpha p(s)}$ contains some knowledge about the
polynomial $p(x)$ that can be extracted by Verifier.

Currently, the verifier verifies that these values satisfy

$$E_{p_{s}} = \left( E_{h_{s}} \right)^{t(s)},\left( E_{p_{s}} \right)^{\alpha} = E_{p_{s}}^{'}$$

It is obvious that if the prover exponentiates $E_{p_{s}}$, $E_{h_{s}}$
and $E_{p_{s}}^{'}$ to the power $\delta$, the equations still hold. So,
the simple solution is to select a secret random $\delta$, calculate
$E_{zk - p_{s}} = \left( E_{p_{s}} \right)^{\delta}$,
$E_{zkh_{s}} = \left( E_{h_{s}} \right)^{\delta}$ and
$E_{zkp_{s}^{'}} = \left( E_{p_{s}}^{'} \right)^{\delta}$ $(mod\ n)$ and
pass the $E_{zk}$ values to the verifier.

---

[TODO: sequence diagram]

Until now, we have achieved sound and complete zero-knowledge proving.
Full zkSNARK also involves another two
properties: succinctness and non-interactivity, but we will not cover those details in this report to avoid further distraction from our main topic.

### Choosing a Proving System
Groth16 and PLONK are two popular zk-SNARK proving systems.

Groth16 is based on pairing-based cryptography and uses a construction called _bilinear pairing_. Groth16 is efficient and features succinct proofs and reasonably fast performance, and it has been widely adopted in applications such as privacy cryptocurrencies like Zcash.

A major drawback of Groth16 is that it requires a trusted setup for each different circuit. A trusted setup is a process that generates the parameters for the proving system. It can be analogous to the process of generating the encrypted powers of $s$ to get $E_{s^{i}}$ in the previous section.

The trusted setup is a one-time process that is expensive and time-consuming, and must be performed by trusted parties using secure Multi-Party Computation (MPC).

PLONK, on the other hand, is a more recently proposed, polynomial-based zk-SNARK proving system that leverages the _polynomial commitment scheme_.

The advantage of PLONK is that it supports a universal trusted setup, which means that the trusted setup can be performed once and used for any circuit. This is a major improvement over Groth16.

However, PLONK is not as efficient as Groth16 as it has a much slower performance and larger key and proof sizes. Taking our circuit as an example, with Groth16, generating the proving and verification keys took us about 2.5 minutes, and generating the proof took only around 15-20 seconds. The proving key size is 59MB. In contrast, with PLONK, it took us about 80 minutes to write 407 out 1163 Lagrange polynomials for the setup, and then the incomplete proving key exhausted all 33GB of free disk space on our machine...

Both Groth16 and PLONK are supported by _SnarkJS_, the tool we will use to generate the witness and proof.
So, either of the two proving systems may be used in the project.
However, due to the prohibitive cost of PLONK, we will just choose Groth16 in our implementation.

### Implementing zk-SNARKs in the Project
To implement zk-SNARKs, we can define zk-SNARK constraints in the form of a circuit using the _circom language_, and then generate the witness and proof using _SnarkJS_.

Here are the general steps of the process:

__A. Circuit definition and preparation for proving__

1. Define the circuit in the circom language.
2. Compile the circom file to into a Rank-1 Constraint System (the .r1cs file) using the circom compiler. This step also generates the script for generating the witness.
3. Trusted Setup - Powers of Tau. With Groth16, the first phase, Powers of Tau, can be performed in advance. So, we just download the Powers of Tau file of the right size from a trusted source [ref:https://github.com/iden3/snarkjs].
4. Trusted Setup - Phase 2. The phase 2 setup, however, is specific to the circuit. Ideally, it requires contributions from multiple trusted parties via MPC. In our demonstration, we just contribute our hardcoded entropy in the phase 2 setup. This step generates the proving key (.zkey file) and the verification key (verification_key.json).

__B. Generating the witness and proof__

1. Prepare the input data for the circuit.
2. Generate the witness by executing the witness generation script with the correct input data.
3. Prove the witness using the proving key, and obtain the proof with public inputs and outputs.

__C. Verifying the proof__

1. Verify the proof, public inputs and outputs using the verification key.

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
- Encrypt `(did_i, did_hi, did_hv, did_v)` with `pub_g` to obtain the _circuit output_, `encryptedPayload`.
- Include `did_hv`, `did_v`, `pub_i` and `pub_g` as _public inputs_.

Proof of the execution process is generated with the proving key from the trusted setup.

Then, the Holder sends public inputs, output and proof to the Verifier. These can be regarded as the zkKYC token and proof.

__3. Verifier verifies the zkKYC token and proof.__

When the Verifier receives the information from the Holder, it checks the following:

- Verify the public inputs and output with the proof using the verification key of the circuit, to ensure the enclosed information is valid.
- Check the public inputs `did_hv` and `did_v` to ensure that the zkKYC token is intended for the Verifier.
- Check the public input `pub_i` to ensure that the Holder is registered with a _recognized_ Issuer.
- Check the public input `pub_g` to ensure that the `encryptedPayload` can be decrypted by the intended Government.

With this information, the Verifier cannot deduce any information about the Holder's identity beyond the Holder's verifier-dedicated DID `did_hv`, but can be assured that the intended party, Government, can decrypt the information for retrieving the Holder's real identity.

__4. Government decrypts the zkKYC token.__

When the Verifier spots suspicious activities of the Holder identified by `did_hv`, the Verifier reports the `encryptedPayload` to the Government for further investigation.

Government decrypts the `encryptedPayload` with its private key `priv_g`, and obtains the tuple `(did_i, did_hi, did_hv, did_v)`. Then, Government can 
- check that this is the zkKYC token of the suspicious Holder `did_hv` doing business with the reporting Verifier `did_v`, and
- contact the Issuer `did_i` to obtain the Holder's real identity with `did_hi`.

Finally, Issuer can retrieve the Holder's real identity, `{ real_name: "Evil Holder", passport_no: "A12345678" }`, for the Government to take further actions.

## Implementation Details
Now, we are clear about the workflow of the zkKYC process. In this section, we will discuss the implementation details of the workflow.
### DID Encoding
By default, Circom signals are bounded by the field size of the curve, which is a 254-bit prime number.
Therefore, for both convenience and efficiency, we decide to encode the DIDs in the form of an array of 248-bit (31-byte) signals.
So, DIDs length limits will be multiples of 31 bytes, and the _multiple_ is specified by the circuit construction parameter `n248Bits`.


### Signing and Verification with EdDSA
The signing and verification of the tuple `(did_i, did_hi)` is done using EdDSA over the Baby Jubjub curve.

In practice, the signature is created on the _Poseidon Hash_ of the encoded `did_i` and `did_hi` concatenated together. We have chosen the Poseidon hash function in favor of the well-known SHA-256 hash function, because the Poseidon hash function is a set of permutations over a prime field, which makes it more efficient for zk-SNARKs.
[ref:https://eips.ethereum.org/EIPS/eip-5988]

In contrast, the SHA-256 hash function is inefficient in our use case, and it also resulted in a large number of constraints in the circuits according to our experiments.

EdDSA Signing is performed in NodeJS using the _@iden3/js-crypto_ library, and verification is performed in the circuit using the _circomlib_ library.

The EdDSA signature consists of two elements, `R` and `S`. `R` is a point on the curve, and `S` is a scalar. We encode `R` as two 254-bit integers in an array, and `S` as a 254-bit integer.

In summary, the zkKYC token generation circuit takes the following inputs for signature verification:
```circom
signal input didI[248];  // encoded did_i
signal input didHI[248]; // encoded did_hi
signal input pubI[2];    // public key of Issuer
signal input sigS;       // S element of the EdDSA signature
signal input sigR[2];    // R element of the EdDSA signature
```

The circuit execution would fail if the signature is invalid.

### Message Representation in ElGamal Encryption
Before we discuss the encryption and decryption process, we need to clarify the message representation in the ElGamal encryption.

Because we implement ElGamal encryption over the Baby Jubjub curve, what it encrypts is essentially a _point_ on the curve. Therefore, we need a way to represent an arbitrary message with a point on the curve.

An existing solution is to pick a random point on the curve, and subtract the message from its x-coordinate [ref:https://ethresear.ch/t/elgamal-encryption-decryption-and-rerandomization-with-circom-support/8074] to get a `xIncrement` value. Then, the message can be represented by the point and `xIncrement`.

We improved this solution by performing XOR, instead of subtraction, between the lowest 253 bits of the x-coordinate and the message up to 253 bits, to get a `xmXor` value. Note that we do not utilize all 254 bits of the x-coordinate, because otherwise `xmXor` may overflow the BabyJub curve field size.

In the existing solution, we need to assert that the x-coordinate of the point is greater than the message, which can possibly fail, especially when the message integer is large. In our solution, the encoding can always succeed.

Also, our solution has the advantage that the representing point, which acts as the plaintext in the succeeding ElGamal encryption, can be _uniformly_ chosen at random, while the existing solution cannot as its x-coordinate is lower-bounded by the message. This advantage increases the security level of the entire encryption process.

### Token Encryption and Decryption with ElGamal and AES
This subsection describes how we achieve the public key encryption and decryption of the zkKYC token.

Encryption is performed in the circom circuit so that we can prove the proper encryption of the zkKYC token in the zk-SNARK proof, while decryption is done by the Government in any environment.

Briefly speaking, we first encrypt the payload with AES using a random symmetric key, and then encrypt the symmetric key with ElGamal using the Government's public key.

__AES Encryption__

As mentioned in the previous subsection, plaintext messages in ElGamal encryption are represented by a point and an `aesKeyXmXor` value. As the AES key will be later encrypted with ElGamal, it is input
to the circuit as a point `aesKeyPoint`, and a _public_ input value `aesKeyXmXor`.
Therefore, the first step is to obtain the AES key by XORing the `aesKeyXmXor` value with the lowest 253 bits of the x-coordinate of the point.

The circuit inputs also include the initial vector `iv` for AES, which is a randomly generated array of 128 bits.

After obtaining the AES key, we encrypt the payload (`did_i`, `did_hi`, `did_hv`, `did_v`) with the key and `iv`, into a ciphertext.
The `iv` is then appended to the ciphertext, and the resulting bit array is the `encryptedPayload`.

To encrypt the payload, we use the AES-256-CTR cipher, and the implementation is adapted from _Electron-Labs/aes-circom_ [ref:https://github.com/Electron-Labs/aes-circom], where they implemented the AES-GCM-SIV.

We did not choose AES-GCM-SIV due to its computational complexity, and we do not require the integrity guarantee it provides.
We just use AES-256-CTR circuit in their repository, and we modified it to match the bit endianness we are using in the rest of the project.

__ElGamal Encryption__

After AES encryption, we encrypt the AES key with ElGamal using the Government's public key. 
With the AES key represented by `aesKeyPoint` and `aesKeyXmXor`, we just apply the ElGamal encryption on the `aesKeyPoint`, and output the ElGamal ciphertext represented by two points `c1` and `c2`.

The random number required by ElGamal encryption is taken as an input signal `elGamalR`.

In summary, after the encryption process, the circuit takes the following inputs:
```
signal input didI[n248Bits];  // encoded did_i
signal input didHI[n248Bits]; // encoded did_hi
signal input didHV[n248Bits]; // encoded did_hv
signal input didV[n248Bits];  // encoded did_v
signal input aesKeyPoint[2]; // the point in AES key representation
signal input aesKeyXmXor; // the xmXor value in AES key representation
signal input aesIV[128];  // the 128-bit AES initial vector
signal input govPubKey[2];    // public key of Government
signal input elGamalR; // the random number for ElGamal encryption
```
 and generates the following public information that Government can use to decrypt the zkKYC token:

```javascript
[
    c1X, c1Y,  // circuit output
    c2X, c2Y,  // circuit output
    ...encryptedPayload, // circuit output
    aesKeyXmXor  // circuit public input
]
```

__Decryption Process__

Using the above public information, the Government can decrypt the zkKYC token by the following steps:

- Decrypt `[c1X, c1Y, c2X, c2Y]` with the Government's private key to obtain the AES key point `aesKeyPoint`.
- XOR the lowest 253 bits of the x-coordinate of `aesKeyPoint` with `aesKeyXmXor` to obtain the AES key.
- Decrypt `encryptedPayload` with the AES key to obtain the payload (`did_i`, `did_hi`, `did_hv`, `did_v`).

### Bit Lengths of Components — 248, 253, 254 or 256?
You may have noticed that we use various bit lengths in the project implementation.
Those values are carefully chosen to maximize the security of the system, while avoiding overflow.
In this subsection, we will summarize bit lengths for the components and explain the rationale behind those choices.

Generally, signals in a Circom circuit should be bounded by the finite field that the underlying elliptic curve is defined on.
In our case, the _Baby Jubjub Elliptic Curve_ is defined over the field $F_p$, where $p$ is a _254-bit_ prime number [ref:https://eips.ethereum.org/EIPS/eip-2494].
Given this fact, we define the bit lengths for the following components in the project:

__DID Representation (248 bits):__ A DID is represented by an array of 248-bit unsigned integers. Each integer can be interpreted as a 31-byte string.

__AES Key (253 bits):__ We use a 253-bit key for AES-256 encryption, instead of the standard 256-bit key.
This is because this key will be encoded into a point on the Baby Jubjub curve and an XOR value as discussed in an earlier subsection.
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

### Interfaces and Packaging
The ZKP part of this project is relatively independent of the SSI part. So, we group the ZKP actions by roles and define the interfaces as follows:

---
__Issuer__

`generateKeyPair(privKey?: string) => { priv: string, pub: [string, string] } ` &nbsp; Generate a key pair for the issuer. If `privKey` is provided, the key pair will be derived from the private key. Otherwise, a random private key will be generated.

`signDidRecord(didI: string, didHI: string, privKey: string) => { s: string, r: string[] }` &nbsp; Sign the DID record with the private key.

__Holder__

`generateZkKycProof(didI: string, didHI: string, didHV: string, didV: string, sigS: string, sigR: string[], issuerPubKey: string[], govPubKey: string[]) => { proofJson: string, publicJson: string }` &nbsp; Generate the zkKYC proof and public information, including the encrypted contents and public keys.

__Verifier__

`parsePublic(publicJson: string) => { aesKeyPointCipher: { c1: string[], c2: string[] }, encryptedPayload: string, didHV: string, didV: string, issuerPubKey: string[], govPubKey: string[], aesKeyXmXor: string }` &nbsp; Parse the public information generated by the Holder into an object. The parsed object can be easily read by the Verifier and passed to the government for decryption.

`verifyZkKycProof(proofJson: string, publicJson: string) => boolean` &nbsp; Verify the zkKYC proof and public information to check if the information is valid.

__Government__

`decryptToken(parsedPublic: string, privKey: string) => { didI: string, didHI: string, didHV: string, didV: string }` &nbsp; Decrypt the zkKYC token with the Government's private key to obtain the DIDs in the token.

`generateKeyPair(privKey?: string) => { priv: string, pub: [string, string] } ` &nbsp; Generate a key pair for the issuer. If `privKey` is provided, the key pair will be derived from the private key. Otherwise, a random private key will be generated.

---

These interfaces are packaged into a NodeJS module __zkkyc-js__ and can be imported into the SSI controller written in NodeJS.
For this method, we strongly suggest using separate _worker threads_ to run the zkKYC actions to avoid blocking other tasks in the SSI controller thread, because the ZKP process is very time-consuming and NodeJS is single-threaded.

We also implemented GRPC services for these interfaces to facilitate the integration with SSI controllers written in other languages. You can start the GRPC server by running `npm run grpc` in the __zkkyc-js__ directory.

# Requirements Review
Finally, let us review the requirements of the zkKYC solution concept and see how the project meets those requirements.

__No correlating signatures__

This is achieved by including the signature verification process in the ZKP circuit.

[TODO: check with the original zkKYC paper]

# Future Work
__Optimize Implementation__ &nbsp; For simplicity, we did not consider the performance and efficiency of the implementation in this project.
We can identify several areas for optimization:

- Compared to ElGamal encryption, ECDH is more efficient and secure. We can use ECDH to derive the shared secret for symmetrically encrypting the DIDs payload.
- AES-256 encryption results in large circuits. For instance, our circuit uses the plain AES-256-CTR circuit to encrypt just 32 bytes of data, but has more than 120,000 constraints and generates a 21.7MB R1CS file! We should find some _zk-friendly_ alternatives for token symmetric encryption.
- For clearer demonstrations, we used the uncompressed form of Baby Jubjub points in the project (two 254-bit integers). In practice, we can pack a point into one single 255-bit integer to improve efficiency.

__Adapt to a Common Elliptic Curve__ &nbsp; We use the Baby Jubjub curve in this project, which is a special curve designed for zkSNARKs and the only reliable curve available at the moment. However, it is not widely used in practice. We may want to consider adapting the project to a more common elliptic curve, such as the Ed25519 curve.
As a prerequisite, this will need an _efficient_ circom implementation of the curve.

__Explore Other Proving Systems__ &nbsp; We use the Groth16 proving system in this project. However, we may want to consider other proving systems in practice, because Groth16 requires a trusted setup for each circuit, and this may not always be practical.
Further study and research are needed to find the most suitable proving system for zkKYC.

__Integrate into DeFi Protocols__ &nbsp; This could be the most exciting potential of the project, and has also been discussed in the succeeding zkKYC paper – _zkKYC in DeFi_ [ref:https://eprint.iacr.org/2022/321]. This project can be easily extended to integrate with DeFi protocols, as Circom can generate Solidity smart contracts for proof verification. Then, a DeFi protocol can include the zkKYC verification process in its smart contract, and require users to submit a valid zkKYC proof before they can use the protocol. This will enable DeFi protocols to provide a more trustful and still privacy-preserving service to authenticated users.

# Conclusion
In this project, we have implemented a zkKYC solution concept based on the zkKYC paper [ref:https://eprint.iacr.org/2020/1186] and the zkSNARKs technology. We have also integrated the zkKYC solution into the SSI controller written in NodeJS, and demonstrated the zkKYC process in a simple use case.

# Appendix
## Project Setup
## Project Code Navigation
### Circom & SnarkJS
#### Circuits
#### Services
#### API
#### Scripts

### Hyperledger Aries
