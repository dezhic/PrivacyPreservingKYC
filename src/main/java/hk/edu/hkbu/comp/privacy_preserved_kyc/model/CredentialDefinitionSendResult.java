package hk.edu.hkbu.comp.privacy_preserved_kyc.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CredentialDefinitionSendResult {
  @JsonProperty("credential_definition_id")
  private String credentialDefinitionId = null;
}
