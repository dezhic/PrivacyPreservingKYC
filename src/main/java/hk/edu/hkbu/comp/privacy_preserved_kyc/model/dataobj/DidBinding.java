package hk.edu.hkbu.comp.privacy_preserved_kyc.model.dataobj;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DidBinding {
    private String did;
    private String customer;
}
