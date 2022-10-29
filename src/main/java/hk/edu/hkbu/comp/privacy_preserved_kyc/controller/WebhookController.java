package hk.edu.hkbu.comp.privacy_preserved_kyc.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;


/**
 * Webhooks that are called by the cloud agent upon events
 */
@RestController
@Slf4j
public class WebhookController {

    @PostMapping(value = "/webhooks/topic/{topic}")
    public String topic(@PathVariable String topic, HttpEntity<String> req) {
        // TODO: implement aries topic webhooks
        log.info("Received webhook topic {}", topic);
        log.info(req.getBody());
        return "ok";
    }

    @GetMapping("/webhooks/pres_req/{presReqId}")
    public String presReq(@PathVariable String presReqId) {
        // TODO: implement aries webhooks presentation request webhooks
        return "PRESENTATION OF " + presReqId;
    }
}
