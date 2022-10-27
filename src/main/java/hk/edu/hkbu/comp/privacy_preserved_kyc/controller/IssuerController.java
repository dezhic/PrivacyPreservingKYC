package hk.edu.hkbu.comp.privacy_preserved_kyc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

@RestController
public class IssuerController {
    public IssuerController() {
        // TODO: IssuerController initialization
        // Reference:
        //   - demo/runners/faber.py:main
        //   - demo/runners/agent_container.py:AriesAgent::__init__
        //   - demo/runners/agent.py:DemoAgent::__init__

        // Assume that ACA-Py is started and running on remote
        // TODO: need to figure out required ACA-Py startup arguments

        // TODO: initiate Agent instance
        // Reference: demo/runners/support/agent.py:DemoAgent::__init__
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
