package hk.edu.hkbu.comp.privacy_preserved_kyc.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConnectionInvitation {
  @JsonProperty("@id")
  private String id;

  @JsonProperty("@type")
  private String type;

  @JsonProperty("did")
  private String did;

  @JsonProperty("imageUrl")
  private String imageUrl;

  @JsonProperty("label")
  private String label;

  @JsonProperty("recipientKeys")
  private List<String> recipientKeys;

  @JsonProperty("routingKeys")
  private List<String> routingKeys;

  @JsonProperty("serviceEndpoint")
  private String serviceEndpoint;

}

