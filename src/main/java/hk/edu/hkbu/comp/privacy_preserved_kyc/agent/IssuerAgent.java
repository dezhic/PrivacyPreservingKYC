package hk.edu.hkbu.comp.privacy_preserved_kyc.agent;

import hk.edu.hkbu.comp.privacy_preserved_kyc.config.AgentProperties;
import hk.edu.hkbu.comp.privacy_preserved_kyc.model.*;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@Component
public class IssuerAgent {
    /**
     * - not supporting revocation
     * - use AIP 2.0
     * - multi_ledger false
     * <p>
     * - genesis_txns xxxxxxxx
     * - genesis_txn_list None
     * - ident dez_bank
     * - start_port 8020 (default)
     * - no_auto None
     * - revocation False
     * - tail_server_base_url None
     * - show_timing None
     * - multitenant None
     * - mediation None
     * - cred_type indy
     * - use_did_exchange True
     * - wallet_type indy
     * - public_did None  TODO: ??
     * - seed random
     * - arg_file None
     * - aip 20
     * - endorser_role None
     * - reuse_connection None
     * - taa_accept None
     * <p>
     * - wallet_name dez_bank_wallet
     * - wallet_key xxxxxxxx
     * <p>
     * - schema_name ???
     * - schema_attrs ???
     * - create_endorser_agent False
     * <p>
     * - connection_id
     **/

    private final RestTemplate restTemplate;
    private final AgentProperties agentProperties;

    @Getter
    private String publicDid;
    @Getter
    private String schemaId;
    @Getter
    private final String schemaName;
    @Getter
    private final List<String> schemaAttrs;
    @Getter
    private final String schemaVersion;

    @Autowired
    public IssuerAgent(RestTemplate restTemplate, AgentProperties agentProperties) throws Exception {
        this.restTemplate = restTemplate;
        this.agentProperties = agentProperties;
        schemaName = "customer_schema";
        schemaAttrs = Arrays.asList("name", "age", "citizenship", "asset_value");
        schemaVersion = "0.%d".formatted(System.currentTimeMillis() / 10000);  // temporarily set version based on time
        initialize();
    }

    /**
     * Initialize issuer agent
     * - create a local public DID
     * - register the DID on the ledger
     * - publish credential schema
     */
    private void initialize() throws Exception {
        // Create DID (TODO: persist wallet; specify existing DID)
        DIDResult result = restTemplate.postForObject(
                agentProperties.getEndpoint() + "/wallet/did/create",
                DIDCreate.builder()
                        .method(DIDCreate.MethodEnum.SOV)
                        .options(DIDCreateOptions.builder()
                                .keyType(DIDCreateOptions.KeyTypeEnum.ED25519)
                                .build())
                        .build(),
                DIDResult.class
        );
        log.debug("Created DID: {}", result);
        // Register public DID on the ledger
        if (result == null) {
            throw new Exception("Failed to create DID");
        }
        DID did = result.getResult();
        DID posted = restTemplate.postForObject(
                agentProperties.getLedgerUrl() + "/register",
                did,
                DID.class
        );
        log.debug("Posted DID: {}", posted);

        if (posted == null) {
            throw new Exception("Failed to post DID to the ledger");
        }

        Map<String, String> map = new HashMap<>();
        map.put("did", posted.getDid());
        // Set public DID
        String pubDidUrl = UriComponentsBuilder.fromHttpUrl(agentProperties.getEndpoint() + "/wallet/did/public")
                .queryParam("did", posted.getDid()).build().toString();
        DIDResult pubDidResult = restTemplate.postForObject(
                pubDidUrl,
                map,
                DIDResult.class
        );
        log.debug("Set public DID: {}", pubDidResult);
        if (pubDidResult == null) {
            throw new Exception("Failed to set public DID");
        }
        publicDid = pubDidResult.getResult().getDid();

        // Create schema
        schemaId = createSchemaCredDef(schemaName, schemaAttrs, schemaVersion);

    }

    private String createSchemaCredDef(String schemaName, List<String> schemaAttrs, String schemaVersion) {
        SchemaSendRequest request = SchemaSendRequest.builder()
                .schemaName(schemaName)
                .schemaVersion(schemaVersion)
                .attributes(schemaAttrs)
                .build();

        TxnOrSchemaSendResult result = restTemplate.postForObject(
                agentProperties.getEndpoint() + "/schemas",
                request,
                TxnOrSchemaSendResult.class
        );
        log.debug("Created schema: {}", result);
        if (result != null) {
            return result.getSent().getSchemaId();
        } else {
            return null;
        }
    }
}
