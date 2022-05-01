import { useCallback } from "react";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";

export const onSuccess = useCallback<PlaidLinkOnSuccess>(
  (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
    // log and save metadata
    console.log("METADATA: ", metadata);
    // exchange public token
    fetch("http://localhost:8080/api/exchange-public-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_token: public_token,
      }),
    })
      .then((res) => console.log("RESPONSE: ", res))
      .catch((error) => console.error(error));
  },
  []
);
