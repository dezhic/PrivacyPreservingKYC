package hk.edu.hkbu.comp.privacy_preserved_kyc.model.aries;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TxnOrSchemaSendResultSent {

    @JsonProperty("schema")
    private Schema schema;

    @JsonProperty("schema_id")
    private String schemaId;

}