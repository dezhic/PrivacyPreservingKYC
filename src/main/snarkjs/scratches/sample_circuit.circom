pragma circom 2.0.0;

template SimpleChecks() {
    signal input a;
    signal input b;
    signal input c;
    signal input d;
    signal output out;

    // force a + b = c
    a + b === c;

    // force b * c = d
    b * c === d;

    // output c + d
    out <== c + d;

}

component main {public [a]} = SimpleChecks();
