package hk.edu.hkbu.comp.privacy_preserved_kyc.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SchemaDefinition {
    private String schemaName;
    private String schemaVersion;
    private List<String> attributes;
}
