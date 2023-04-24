# This file setups the powers of tau and contributes to it with a hardcoded entropy.
# It's slow and insecure and is for demo only.
# We sugguest you to use the official powers of tau file from https://github.com/iden3/snarkjs
# In this project, we need at least the power of 17, which can be downloaded from 
#   https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_17.ptau
mkdir -p proof/setup
cd proof/setup
mkdir -p powers_of_tau
cd powers_of_tau
snarkjs powersoftau new bn128 17 pot17_0000.ptau -v
snarkjs powersoftau contribute pot17_0000.ptau pot17_0001.ptau --name="Hardcoded Contribtion" -e="random_qownfoawjfwoqgj34" -v
snarkjs powersoftau prepare phase2 pot17_0001.ptau pot17_final.ptau -v
cd ..
cd ../../
