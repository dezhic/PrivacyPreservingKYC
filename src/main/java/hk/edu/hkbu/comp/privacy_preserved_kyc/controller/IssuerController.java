package hk.edu.hkbu.comp.privacy_preserved_kyc.controller;

import hk.edu.hkbu.comp.privacy_preserved_kyc.config.AgentProperties;
import hk.edu.hkbu.comp.privacy_preserved_kyc.model.aries.ConnectionList;
import hk.edu.hkbu.comp.privacy_preserved_kyc.model.aries.CreateInvitationRequest;
import hk.edu.hkbu.comp.privacy_preserved_kyc.model.aries.InvitationResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

@Controller
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

    @GetMapping("/issuer")
    public String index(Model model) {
        return "issuer/index";
    }

    @GetMapping("/issuer/customer-portal")
    public String customerPortal(Model model) {
        return "issuer/customer-portal";
    }

    @GetMapping("/issuer/admin-portal")
    public String adminPortal(Model model) {
        return "issuer/admin-portal";
    }

    @ResponseBody
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

    @ResponseBody
    @GetMapping("/issuer/connections")
    public ConnectionList connections() {
        return restTemplate.getForObject(
                agentProperties.getEndpoint() + "/connections",
                ConnectionList.class
        );
    }
}
