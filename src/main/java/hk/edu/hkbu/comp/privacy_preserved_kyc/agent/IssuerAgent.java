package hk.edu.hkbu.comp.privacy_preserved_kyc.agent;

import hk.edu.hkbu.comp.privacy_preserved_kyc.model.SchemaDefinition;

import java.util.List;


public class IssuerAgent {
    /**
     *  - not supporting revocation
     *  - use AIP 2.0
     *  - multi_ledger false
     *
     *  - genesis_txns xxxxxxxx
     *  - genesis_txn_list None
     *  - ident dez_bank
     *  - start_port 8020 (default)
     *  - no_auto None
     *  - revocation False
     *  - tail_server_base_url None
     *  - show_timing None
     *  - multitenant None
     *  - mediation None
     *  - cred_type None
     *  - use_did_exchange True
     *  - wallet_type askar
     *  - public_did None  TODO: ??
     *  - seed random
     *  - arg_file None
     *  - aip 20
     *  - endorser_role None
     *  - reuse_connection None
     *  - taa_accept None
     *
     *  - wallet_name dez_bank_wallet
     *  - wallet_key xxxxxx
     *
     *  - schema_name ???
     *  - schema_attrs ???
     *  - create_endorser_agent False
     *
     *  - connection_id
     **/

    private String genesis;  // genesis transaction
    private String credDefId;
    private String schemaName;
    private List<String> schemaAttrs;

    public IssuerAgent() {
        // Reference
        //   - agent_container.py:AgentContainer::__init__
        //   - agent_container.py:AgentContainer::initialize
        genesis = "xxxxxxxx";  // TODO: fix hardcode
        // TODO: define properties

        initialize();
    }

    private void initialize() {
        // Start webhook listener - automatic in Spring

        // TODO: ? register public DID (by admin_POST "/wallet/did/create")

        // Create schema/credential definition
        credDefId = createSchemaCredDef(schemaName, schemaAttrs, "0.0.1");
    }

    private String createSchemaCredDef(String schemaName, List<String> schemaAttrs, String version) {
        // Reference demo/runner/support/agent.py:DemoAgent::register_shcema_and_creddef
        SchemaDefinition schemaDef = SchemaDefinition.builder()
                .schemaName(schemaName)
                .schemaVersion(version)
                .attributes(schemaAttrs)
                .build();

        String schemaId = ""; // TODO: admin_POST("/schemas")

        return schemaId;
    }
}
