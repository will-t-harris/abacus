import { useCallback } from "react";
import {
  PlaidLinkOnEvent,
  PlaidLinkOnEventMetadata,
  PlaidLinkStableEvent,
} from "react-plaid-link";

export const onEvent = useCallback<PlaidLinkOnEvent>(
  (
    eventName: PlaidLinkStableEvent | string,
    metadata: PlaidLinkOnEventMetadata
  ) => {
    // log eventName and metadata
    console.log("EVENT NAME: ", eventName);
    console.log("METADATA: ", metadata);
  },
  []
);
