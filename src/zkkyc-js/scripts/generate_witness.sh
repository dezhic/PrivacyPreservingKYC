mkdir -p witness;
cd witness;
node ../build/generate_zkkyc_token_js/generate_witness.js ../build/generate_zkkyc_token_js/generate_zkkyc_token.wasm ../input.json generate_zkkyc_token.wtns;
cd ..;
