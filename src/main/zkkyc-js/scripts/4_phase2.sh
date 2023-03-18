cd proof/setup
mkdir -p phase2
cd phase2
snarkjs groth16 setup ../../../build/generate_zkkyc_token.r1cs ~/Downloads/powersOfTau28_hez_final_18.ptau generate_zkkyc_token_0000.zkey
snarkjs zkey contribute generate_zkkyc_token_0000.zkey generate_zkkyc_token_0001.zkey --name="1st Contributor Name" -v
snarkjs zkey export verificationkey generate_zkkyc_token_0001.zkey verification_key.json
cd ..
cd ../..


