const iden3crypto = require('@iden3/js-crypto');
const crypto = require('crypto');
const test = require("node:test");

function keygen() {
  const privBuf = crypto.randomBytes(32);
  const priv = new iden3crypto.PrivateKey(privBuf);
  const pub = priv.public();
  console.log('priv:', iden3crypto.ffUtils.leBuff2int(privBuf));
  console.log('pub:', pub.p);
//   console.log('pub packed:', iden3crypto.ffUtils.leBuff2int(iden3crypto.babyJub.packPoint(pub.p)));
  console.log('pub compressed:', iden3crypto.ffUtils.leBuff2int(pub.compress()));
  return { priv: priv, pub: pub };
}


const { priv, pub } = keygen();
const didI = 'did:sov:123456789abcdefghi';
const didHI = 'did:peer:abcdefghijklmnopqrstuv';

test('generate the bigint array representation of the credential', t => {
    const { dids2credArr } = require('./sign');
    const credArr = dids2credArr(didI, didHI, 1);
    console.log('credArr:', credArr);
});

test('generate credential buffer, and sign its hash', t => {
    const { dids2credArr, hashCredArr, sign } = require('./sign');
    const credArr = dids2credArr(didI, didHI, 1);
    const hash = hashCredArr(credArr);
    const sig = sign(priv.sk, hash);
    console.log('sig:', sig);
});
