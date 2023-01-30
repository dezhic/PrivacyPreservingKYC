package hk.edu.hkbu.comp.privacy_preserved_kyc.model.aries;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateInvitationRequest {
  @JsonProperty("mediation_id")
  private String mediationId;

  @JsonProperty("metadata")
  private Object metadata;

  @JsonProperty("my_label")
  private String myLabel;

  @JsonProperty("recipient_keys")
  private List<String> recipientKeys;

  @JsonProperty("routing_keys")
  private List<String> routingKeys;

  @JsonProperty("service_endpoint")
  private String serviceEndpoint;

}

