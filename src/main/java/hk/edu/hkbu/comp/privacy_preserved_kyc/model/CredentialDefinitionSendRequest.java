package hk.edu.hkbu.comp.privacy_preserved_kyc.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CredentialDefinitionSendRequest {

    @JsonProperty("schema_id")
    private String schemaId;

    @JsonProperty("tag")
    private String tag;

    @JsonProperty("support_revocation")
    private Boolean supportRevocation;

    @JsonProperty("revocation_registry_size")
    private Integer revocationRegistrySize;

}
