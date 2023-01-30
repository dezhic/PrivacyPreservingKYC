package hk.edu.hkbu.comp.privacy_preserved_kyc.dao;

import hk.edu.hkbu.comp.privacy_preserved_kyc.model.dataobj.Admin;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.TimeZone;


@Component
public class AdminDAO extends AbstractDAO {

    public AdminDAO(@Value("classpath:datafiles/admins.tsv") Resource datafile) {
        super(datafile);
    }

    public Admin findFirstByUsername(String username) throws Exception {
        String[] record = findFirst(username, 0);
        return buildObject(record);
    }

    private Admin buildObject(String[] record) throws Exception {
        if (record == null) {
            return null;
        }
        if (record.length != Admin.class.getDeclaredFields().length) {
            throw new Exception("Record corrupted: " + Arrays.toString(record));
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        return Admin.builder()
                .username(record[0])
                .password(record[1])
                .build();
    }

}
