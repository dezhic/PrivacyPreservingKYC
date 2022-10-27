package hk.edu.hkbu.comp.privacy_preserved_kyc.controller;

import hk.edu.hkbu.comp.privacy_preserved_kyc.config.AgentProperties;
import hk.edu.hkbu.comp.privacy_preserved_kyc.model.CreateInvitationRequest;
import hk.edu.hkbu.comp.privacy_preserved_kyc.model.InvitationResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
            AgentProperties agentProperties
    ) {
        this.restTemplate = restTemplate;
        this.agentProperties = agentProperties;

        // TODO: IssuerController initialization
        // Reference:
        //   - demo/runners/faber.py:main
        //   - demo/runners/agent_container.py:AriesAgent::__init__
        //   - demo/runners/agent.py:DemoAgent::__init__

        // Assume that ACA-Py is started and running on remote

        // TODO: initiate Agent instance
        // Reference: demo/runners/support/agent.py:DemoAgent::__init__
        log.debug("Constructing IssuerController");
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


    public String generateInvitation() {
        // TODO: generate invitation
        // Reference:
        //   - demo/runners/faber.py:L430
        //   - demo/runners/agent_container:AriesAgent::generate_invitation
        //   - demo/runners/agent:DemoAgent::get_invite


        return "invitation";
    }
}
