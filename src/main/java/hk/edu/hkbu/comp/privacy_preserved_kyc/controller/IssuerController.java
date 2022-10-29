package hk.edu.hkbu.comp.privacy_preserved_kyc.controller;

import hk.edu.hkbu.comp.privacy_preserved_kyc.config.AgentProperties;
import hk.edu.hkbu.comp.privacy_preserved_kyc.model.ConnectionList;
import hk.edu.hkbu.comp.privacy_preserved_kyc.model.CreateInvitationRequest;
import hk.edu.hkbu.comp.privacy_preserved_kyc.model.InvitationResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@Slf4j
public class IssuerController {

    RestTemplate restTemplate;
    AgentProperties agentProperties;

    @Autowired
    public IssuerController(
            RestTemplate restTemplate,
            AgentProperties agentProperties) {
        this.restTemplate = restTemplate;
        this.agentProperties = agentProperties;
    }

    @PostMapping("/issuer/create-invitation")
    public InvitationResult createInvitation() {
        InvitationResult result = restTemplate.postForObject(
                agentProperties.getEndpoint() + "/connections/create-invitation",
                CreateInvitationRequest.builder().build(),
                InvitationResult.class
        );
        log.debug(result != null ? result.toString() : null);
        // Present the invitation message to invitee
        return result;
    }

    @GetMapping("/issuer/connections")
    public ConnectionList connections() {
        return restTemplate.getForObject(
                agentProperties.getEndpoint() + "/connections",
                ConnectionList.class
        );
    }
}
