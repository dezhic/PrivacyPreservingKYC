package hk.edu.hkbu.comp.privacy_preserved_kyc.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "agent-properties")
public class AgentProperties {
    private String endpoint;
    private String genesisUrl;
    private String ledgerUrl;
}
