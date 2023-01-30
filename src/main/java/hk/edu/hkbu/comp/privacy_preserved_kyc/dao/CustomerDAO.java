package hk.edu.hkbu.comp.privacy_preserved_kyc.dao;

import hk.edu.hkbu.comp.privacy_preserved_kyc.model.dataobj.Customer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.TimeZone;


@Component
public class CustomerDAO extends AbstractDAO {

    public CustomerDAO(@Value("classpath:datafiles/customers.tsv") Resource datafile) {
        super(datafile);
    }

    public Customer findFirstByUsername(String username) throws Exception {
        String[] record = findFirst(username, 0);
        return buildObject(record);
    }

    private Customer buildObject(String[] record) throws Exception {
        if (record == null) {
            return null;
        }
        if (record.length != Customer.class.getDeclaredFields().length) {
            throw new Exception("Record corrupted: " + Arrays.toString(record));
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        return Customer.builder()
                .username(record[0])
                .password(record[1])
                .birthdate(sdf.parse(record[2]))
                .citizenship(record[3])
                .idNo(record[4])
                .deposit(new BigDecimal(record[5]))
                .build();
    }

}
