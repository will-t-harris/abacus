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
import { Dispatch, useCallback } from "react";

interface Props {
  token: string;
  userId: string;
  setPlaidAccessToken: Dispatch<string>;
  setInstitutionName: Dispatch<string>;
}

export function PlaidLink({
  token,
  userId,
  setPlaidAccessToken,
  setInstitutionName,
}: Props) {
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      const queryParams = new URLSearchParams({
        token: public_token,
        institutionName: metadata.institution?.name ?? "",
      });

      fetch(`${import.meta.env.VITE_SERVER_HOST}/token?${queryParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_token: public_token,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPlaidAccessToken(data.accessToken);
          setInstitutionName(metadata.institution?.name ?? "");
        })
        .catch((error) => console.error(error));
    },
    []
  );

  const onExit = useCallback<PlaidLinkOnExit>(
    (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
      console.log("EXIT METADATA: ", metadata);

      if (error !== null && error.error_code === "INVALID_LINK_TOKEN") {
        //TODO generate a new link token
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
      //TODO do we need to respond to any events?
      switch (eventName) {
        default: {
          break;
        }
      }
    },
    []
  );

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
      <button onClick={() => ready && open()}>Open</button>
    </div>
  );
}
