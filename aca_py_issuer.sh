#!/bin/sh
PORTS="8020:8020 8021:8021 " sudo -E scripts/run_docker start \
   --endpoint http://host.docker.internal:8020 \
   --label dezbank.agent \
   --inbound-transport http 0.0.0.0 8020 \
   --outbound-transport http \
   --admin 0.0.0.0 8021 \
   --admin-insecure-mode \
   --wallet-type indy \
   --wallet-name dezbank.agent916333 \
   --wallet-key dezbank.agent916333 \
   --preserve-exchange-records \
   --auto-provision \
   --genesis-url http://dev.greenlight.bcovrin.vonx.io/genesis \
   --trace-target log \
   --trace-tag acapy.events \
   --trace-label dezbank.agent.trace \
   --auto-ping-connection \
   --auto-respond-messages \
   --auto-accept-invites \
   --auto-accept-requests \
   --auto-respond-credential-proposal \
   --auto-respond-credential-offer \
   --auto-respond-credential-request \
   --auto-store-credential \
   --webhook-url http://host.docker.internal:8080/webhooks

