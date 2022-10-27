package hk.edu.hkbu.comp.privacy_preserved_kyc.agent;

public class IssuerAgent {
    private String genesis;  // genesis transaction
    /**
     *  - not supporting revocation
     *  - use AIP 2.0
     *  - genesis_txns xxxxxxxx
     *  - multi_ledger false
     *  - genesis_txn_list None
     *  - ident dez_bank
     *  - public_did None
     *  - wallet_type askar
     *  - wallet_name dez_bank_wallet
     *  - wallet_key xxxxxx
     **/
    public IssuerAgent() {

        genesis = "xxxxxxxx";  // TODO: fix hardcode


    }
}
