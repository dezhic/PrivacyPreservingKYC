package hk.edu.hkbu.comp.privacy_preserved_kyc.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InvitationResult {
  @JsonProperty("connection_id")
  private String connectionId;

  @JsonProperty("invitation")
  private ConnectionInvitation invitation;

  @JsonProperty("invitation_url")
  private String invitationUrl;

}

