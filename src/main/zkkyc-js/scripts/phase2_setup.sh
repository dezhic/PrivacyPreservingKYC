set -e
set -o pipefail

pushd proof
if [[ ! -f powersOfTau28_hez_final_17.ptau ]]; then
  echo "Downloading powersOfTau28_hez_final_17.ptau..."
  wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_17.ptau
fi

echo "Verifying powersOfTau28_hez_final_17.ptau checksum..."
targetChecksum='6247a3433948b35fbfae414fa5a9355bfb45f56efa7ab4929e669264a0258976741dfbe3288bfb49828e5df02c2e633df38d2245e30162ae7e3bcca5b8b49345'
checksum=$(b2sum powersOfTau28_hez_final_17.ptau | awk '{print $1;}')
if [[ $checksum != $targetChecksum ]]; then
  echo "powersOfTau28_hez_final_17.ptau checksum mismatch. Expected $targetChecksum, got $checksum"
  exit 1
fi
echo "Verifed powersOfTau28_hez_final_17.ptau checksum."

echo "Phase 2 setup..."
snarkjs groth16 setup generate_zkkyc_token.r1cs powersOfTau28_hez_final_17.ptau generate_zkkyc_token_0000.zkey -v
echo "Phase 2 contribute (hardcoded enctropy for demo)..."
snarkjs zkey contribute generate_zkkyc_token_0000.zkey generate_zkkyc_token.zkey --name="Hardcoded Contributor" --entropy="hardcoded_asldfkjalskdjflkwegfovnwen" -v
echo "Exporting verification key..."
snarkjs zkey export verificationkey generate_zkkyc_token.zkey verification_key.json
popd
