import { useCallback } from "react";
import {
  PlaidLinkError,
  PlaidLinkOnExit,
  PlaidLinkOnExitMetadata,
} from "react-plaid-link";

export const onExit = useCallback<PlaidLinkOnExit>(
  (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
    // log and save error and metadata
    console.log("METADATA: ", metadata);
    console.error("ERROR: ", error);
    // handle invalid link token
    if (error !== null && error.error_code === "INVALID_LINK_TOKEN") {
      // generate a new link token
    }

    // to handle other error codes see: https://plaid.com/docs/errors
  },
  []
);
