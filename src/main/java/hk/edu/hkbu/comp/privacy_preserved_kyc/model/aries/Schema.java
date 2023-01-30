package hk.edu.hkbu.comp.privacy_preserved_kyc.model.aries;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Schema {
  @JsonProperty("attrNames")
  private List<String> attrNames = null;

  @JsonProperty("id")
  private String id = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("seqNo")
  private Integer seqNo = null;

  @JsonProperty("ver")
  private String ver = null;

  @JsonProperty("version")
  private String version = null;

}
