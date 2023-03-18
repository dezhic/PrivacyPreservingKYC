mkdir -p proof;
cd proof;
circom --r1cs --wasm ../circuits/generate_zkkyc_token.circom;
cd ..;
