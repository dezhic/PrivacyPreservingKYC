mkdir -p proof/setup
cd proof/setup
mkdir -p powers_of_tau
cd powers_of_tau
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
cd ..
cd ../../
