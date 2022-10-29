package hk.edu.hkbu.comp.privacy_preserved_kyc.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DIDCreateOptions {
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

    @JsonProperty("key_type")
    private KeyTypeEnum keyType;

}

