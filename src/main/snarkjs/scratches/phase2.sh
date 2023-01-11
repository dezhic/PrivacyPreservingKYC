cd proof/setup
mkdir -p phase2
cd phase2
snarkjs powersoftau prepare phase2 ../powers_of_tau/pot12_0001.ptau pot12_final.ptau -v
snarkjs groth16 setup ../../../build/sample_circuit.r1cs pot12_final.ptau sample_circuit_0000.zkey
snarkjs zkey contribute sample_circuit_0000.zkey sample_circuit_0001.zkey --name="1st Contributor Name" -v
snarkjs zkey export verificationkey sample_circuit_0001.zkey verification_key.json
cd ..
cd ../..