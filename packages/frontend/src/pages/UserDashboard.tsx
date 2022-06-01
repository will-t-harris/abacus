import { useCallback, useEffect, useState } from "react";
import { PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";
import { Button, Spacer } from "@chakra-ui/react";
import { AppTable } from "../components/AppTable";
import { PlaidItem } from "../shared/types";

interface Props {
  accessToken: string;
}

export function UserDashboard({ accessToken }: Props) {
  const [plaidToken, setPlaidToken] = useState("");
  const [plaidItems, setPlaidItems] = useState<PlaidItem[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    async function createLinkToken() {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_HOST}/token`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      try {
        const { token } = await response.json();

        setPlaidToken(token);
      } catch (error) {
        console.error("ERROR: ", error);
      }
    }

    createLinkToken();
  }, [accessToken]);

  const onPlaidSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, metadata) => {
      // send public_token to server
      await fetch(`${import.meta.env.VITE_SERVER_HOST}/token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicToken: publicToken,
          institutionName: metadata.institution?.name,
        }),
      });
    },
    []
  );

  const { open, ready } = usePlaidLink({
    token: plaidToken,
    onSuccess: onPlaidSuccess,
  });

  async function fetchPlaidItems() {
    const result = await fetch(`${import.meta.env.VITE_SERVER_HOST}/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetPlaidItems($userId: Int!) {
            getPlaidItems(userId: $userId) {
              institutionName
              updatedAt
            }
          }
        `,
        variables: {
          userId: 1,
        },
      }),
    });

    const {
      data: { getPlaidItems },
    }: { data: { getPlaidItems: PlaidItem[] } } = await result.json();

    setPlaidItems([...getPlaidItems]);
  }

  return (
    <div>
      <Spacer height={6} />
      <Button onClick={() => open()} disabled={!ready}>
        Connect to Plaid
      </Button>
      <Spacer height={6} />
      <p>Plaid Token: {plaidToken}</p>
      <Spacer height={6} />
      <Button onClick={fetchPlaidItems}>Fetch Plaid Items</Button>
      <AppTable institutions={plaidItems} />
    </div>
  );
}
