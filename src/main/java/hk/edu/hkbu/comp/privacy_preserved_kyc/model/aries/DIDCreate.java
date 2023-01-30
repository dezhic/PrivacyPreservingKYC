package hk.edu.hkbu.comp.privacy_preserved_kyc.model.aries;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DIDCreate {

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

  @JsonProperty("method")
  private MethodEnum method;

  @JsonProperty("options")
  private DIDCreateOptions options;

  @JsonProperty("seed")
  private String seed;

}
