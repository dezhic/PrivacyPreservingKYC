package hk.edu.hkbu.comp.privacy_preserved_kyc.dao;

import org.springframework.core.io.Resource;

import java.io.*;

public abstract class AbstractDAO {
    protected Resource datafile;

    public AbstractDAO(Resource datafile) {
        this.datafile = datafile;
    }

    protected String[] findFirst(String target, int col) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(datafile.getFile()));
        String line = br.readLine();
        while (line != null) {
            String[] values = line.split("\t");
            if (col < values.length && values[col].equals(target)) {
                return values;
            }
            line = br.readLine();
        }
        return null;
    }

}
