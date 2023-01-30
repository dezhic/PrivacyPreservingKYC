package hk.edu.hkbu.comp.privacy_preserved_kyc.model.aries;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(Include.NON_NULL)
public class TxnOrSchemaSendResult {
  @JsonProperty("sent")
  private TxnOrSchemaSendResultSent sent;

  @JsonProperty("txn")
  private TxnOrSchemaSendResultTxn txn;

  public TxnOrSchemaSendResult sent(TxnOrSchemaSendResultSent sent) {
    this.sent = sent;
    return this;
  }
}
