import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnEvent,
  PlaidLinkStableEvent,
  PlaidLinkOnEventMetadata,
  PlaidLinkOnExit,
  PlaidLinkError,
  PlaidLinkOnExitMetadata,
} from "react-plaid-link";
import { useCallback } from "react";

interface Props {
  token: string;
  userId: string;
}

export function PlaidLink({ token, userId }: Props) {
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
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

  const onExit = useCallback<PlaidLinkOnExit>(
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
  const onEvent = useCallback<PlaidLinkOnEvent>(
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
  // log eventName and metadata
  const config: PlaidLinkOptions = {
    onSuccess: onSuccess,
    onExit: onExit,
    onEvent: onEvent,
    token: token,
  };

  const { open, exit, ready } = usePlaidLink(config);
  return (
    <div>
      <p>PlaidLink</p>
      <button onClick={() => open()}>Open</button>
    </div>
  );
}
