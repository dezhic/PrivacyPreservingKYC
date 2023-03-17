mkdir -p witness;
cd witness;
node ../build/sample_circuit_js/generate_witness.js ../build/sample_circuit_js/sample_circuit.wasm ../input.json sample_circuit.wtns;
cd ..;
