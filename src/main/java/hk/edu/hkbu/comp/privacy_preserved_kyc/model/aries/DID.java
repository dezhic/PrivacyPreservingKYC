package hk.edu.hkbu.comp.privacy_preserved_kyc.model.aries;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DID {
  @JsonProperty("did")
  private String did;

  @JsonProperty("key_type")
  private KeyTypeEnum keyType;

  @JsonProperty("method")
  private MethodEnum method;

  @JsonProperty("posture")
  private PostureEnum posture;

  @JsonProperty("verkey")
  private String verkey;

  public enum KeyTypeEnum {
    ED25519("ed25519"),
    BLS12381G2("bls12381g2");

    private String value;

    KeyTypeEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }
  }

  public enum MethodEnum {
    KEY("key"),
    SOV("sov");

    private String value;

    MethodEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

  }

  public enum PostureEnum {
    PUBLIC("public"),
    POSTED("posted"),
    WALLET_ONLY("wallet_only");

    private String value;

    PostureEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

  }
}
