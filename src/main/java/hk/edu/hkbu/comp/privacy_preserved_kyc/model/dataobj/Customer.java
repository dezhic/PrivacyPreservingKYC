package hk.edu.hkbu.comp.privacy_preserved_kyc.model.dataobj;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
public class Customer {
    private String username;
    private String password;
    private Date birthdate;
    private String citizenship;
    private String idNo;
    private BigDecimal deposit;
}
