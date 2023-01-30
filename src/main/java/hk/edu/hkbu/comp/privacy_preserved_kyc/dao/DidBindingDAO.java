package hk.edu.hkbu.comp.privacy_preserved_kyc.dao;

import hk.edu.hkbu.comp.privacy_preserved_kyc.model.dataobj.DidBinding;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;

@Component
public class DidBindingDAO extends AbstractDAO {

    public DidBindingDAO(@Value("classpath:datafiles/did_bindings.tsv") Resource datafile) {
        super(datafile);
    }

    public DidBinding findFirstByDid(String did) throws Exception {
        String[] record = findFirst(did, 0);
        return buildObject(record);
    }

    private DidBinding buildObject(String[] record) throws Exception {
        if (record == null) {
            return null;
        }
        if (record.length != DidBinding.class.getDeclaredFields().length) {
            throw new Exception("Record corrupted: " + Arrays.toString(record));
        }
        return DidBinding.builder()
                .did(record[0])
                .customer(record[1])
                .build();
    }

}
