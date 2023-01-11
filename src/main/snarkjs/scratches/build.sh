mkdir -p build;
cd build;
circom --r1cs --wasm --sym ../"$1";
cd ..;
