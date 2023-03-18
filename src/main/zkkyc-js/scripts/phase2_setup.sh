pushd proof
echo "Phase 2 setup..."
snarkjs groth16 setup generate_zkkyc_token.r1cs powersOfTau28_hez_final_17.ptau generate_zkkyc_token_0000.zkey -v
echo "Phase 2 contribute (hardcoded enctropy for demo)..."
snarkjs zkey contribute generate_zkkyc_token_0000.zkey generate_zkkyc_token.zkey --name="Hardcoded Contributor" --entropy="hardcoded_asldfkjalskdjflkwegfovnwen"
echo "Exporting verification key..."
snarkjs zkey export verificationkey generate_zkkyc_token.zkey verification_key.json
popd
