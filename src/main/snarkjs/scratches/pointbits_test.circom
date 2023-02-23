pragma circom 2.0.0;

include "../circomlib/circuits/ponitbits.circom";

template Point2BitsTest() {
    signal input x;
    signal input y:

    component point2bits = Point2Bits_Strict();

    point2bits.in[0] <== x;
    point2bits.in[1] <== y;

    for (i=0; i<254; i++) {
        log(i, ":", point2bits.out[i]);
    }

}

public 