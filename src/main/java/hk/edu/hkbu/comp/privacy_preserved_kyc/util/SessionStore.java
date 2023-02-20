package hk.edu.hkbu.comp.privacy_preserved_kyc.util;

import java.util.Map;

public interface SessionStore {
    String createSession();
    Map<String, Object> retrieveSessionContext(String sessionId);
}
