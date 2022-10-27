package hk.edu.hkbu.comp.privacy_preserved_kyc.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class WebhookController {
    // TODO: implement aries webhooks
    // Reference: demo/runners/support/agent.py:listen_webhooks (self, webhook_port)

    @PostMapping("/webhooks/topic/{topic}")
    public void topic(@PathVariable String topic) {
        // TODO: implement aries webhooks
    }

    @GetMapping("/webhooks/pres_req/{presReqId}")
    public void presReq(@PathVariable String presReqId) {
        // TODO: implement aries webhooks
    }
}
