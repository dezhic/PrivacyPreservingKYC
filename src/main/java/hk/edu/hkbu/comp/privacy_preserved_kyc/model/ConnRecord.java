package hk.edu.hkbu.comp.privacy_preserved_kyc.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConnRecord {

  public enum AcceptEnum {
    MANUAL("manual"),
    AUTO("auto");

    private String value;

    AcceptEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

  }

  @JsonProperty("accept")
  private AcceptEnum accept;

  @JsonProperty("alias")
  private String alias;

  @JsonProperty("connection_id")
  private String connectionId;

  public enum ConnectionProtocolEnum {
    CONNECTIONS_1_0("connections/1.0"),
    DIDEXCHANGE_1_0("didexchange/1.0");

    private String value;

    ConnectionProtocolEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }
  }

  @JsonProperty("connection_protocol")
  private ConnectionProtocolEnum connectionProtocol;

  @JsonProperty("created_at")
  private String createdAt;

  @JsonProperty("error_msg")
  private String errorMsg;

  @JsonProperty("inbound_connection_id")
  private String inboundConnectionId;

  @JsonProperty("invitation_key")
  private String invitationKey;

  public enum InvitationModeEnum {
    ONCE("once"),
    
    MULTI("multi"),
    
    STATIC("static");

    private String value;

    InvitationModeEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }
  }

  @JsonProperty("invitation_mode")
  private InvitationModeEnum invitationMode;

  @JsonProperty("invitation_msg_id")
  private String invitationMsgId;

  @JsonProperty("my_did")
  private String myDid;

  @JsonProperty("request_id")
  private String requestId;

  @JsonProperty("rfc23_state")
  private String rfc23State;

  public enum RoutingStateEnum {
    NONE("none"),
    
    REQUEST("request"),
    
    ACTIVE("active"),
    
    ERROR("error");

    private String value;

    RoutingStateEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

  }

  @JsonProperty("routing_state")
  private RoutingStateEnum routingState;

  @JsonProperty("state")
  private String state;

  @JsonProperty("their_did")
  private String theirDid;

  @JsonProperty("their_label")
  private String theirLabel;

  @JsonProperty("their_public_did")
  private String theirPublicDid;

  public enum TheirRoleEnum {
    INVITEE("invitee"),
    
    REQUESTER("requester"),
    
    INVITER("inviter"),
    
    RESPONDER("responder");

    private String value;

    TheirRoleEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }
  }

  @JsonProperty("their_role")
  private TheirRoleEnum theirRole;

  @JsonProperty("updated_at")
  private String updatedAt;

}

