import { useCallback, useEffect, useRef, useState } from "react";
import { PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";
import { Button, Select, Spacer } from "@chakra-ui/react";
import { InstitutionsTable } from "../components/InstitutionsTable";
import { PlaidItem } from "../shared/types";

interface Props {
  accessToken: string;
}

export function UserDashboard({ accessToken }: Props) {
  const [plaidToken, setPlaidToken] = useState("");
  const [plaidItems, setPlaidItems] = useState<PlaidItem[]>([]);
  const selectInstitutionRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    async function createLinkToken() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_HOST}/token`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

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
      try {
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
      } catch (error) {
        console.error("ERROR: ", error);
      }
    },
    []
  );

  const { open, ready } = usePlaidLink({
    token: plaidToken,
    onSuccess: onPlaidSuccess,
  });

  async function fetchPlaidItems() {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_SERVER_HOST}/graphql`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
          query GetPlaidItems($input: GetPlaidItemsInput!) {
            getPlaidItems(input: $input) {
              itemId
              institutionName
              updatedAt
            }
          }
        `,
            variables: {
              input: {
                userId: 1,
              },
            },
          }),
        }
      );

      const {
        data: { getPlaidItems },
      }: { data: { getPlaidItems: PlaidItem[] } } = await result.json();

      setPlaidItems([...getPlaidItems]);
    } catch (error) {
      console.error("ERROR: ", error);
    }
  }

  async function saveAccountsForItem() {
    if (!selectInstitutionRef.current?.value) {
      console.log("No ref value.");
      return;
    }

    const selectedItem = plaidItems[Number(selectInstitutionRef.current.value)];

    try {
      await fetch(`${import.meta.env.VITE_SERVER_HOST}/graphql`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CreateAccounts($input: CreateAccountsInput!) {
              createAccounts(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              institutionName: selectedItem.institutionName,
            },
          },
        }),
      });
    } catch (error) {
      console.error("ERROR: ", error);
    }
  }

  async function fetchTransactionsForAccount() {
    console.log("fetchTransactionsForAccount");
    try {
      const result = await fetch(
        `${import.meta.env.VITE_SERVER_HOST}/graphql`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            query: `
            mutation FetchTransactionsForAccount($input: FetchTransactionsForAccountInput!) {
              fetchTransactionsForAccount(input: $input) {
                id
              }
            }
          `,
            variables: {
              input: {
                accountId: 4,
              },
            },
          }),
        }
      );

      const data = await result.json();

      console.log("HERE BE DATA: ", data);
    } catch (error) {
      console.error("ERROR: ", error);
    }
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
      <Spacer height={6} />
      <InstitutionsTable institutions={plaidItems} />
      <Spacer height={6} borderBottom="2px solid rebeccapurple" mb="6" />
      <Select ref={selectInstitutionRef} width="600px" mb="6">
        {plaidItems.length !== 0 &&
          plaidItems.map((plaidItem, index) => (
            <option value={index} key={plaidItem.institutionName}>
              {plaidItem.institutionName}
            </option>
          ))}
      </Select>
      <Button onClick={saveAccountsForItem}>Save Accounts for Item</Button>
      <Button onClick={fetchTransactionsForAccount}>
        Fetch Transactions for Selected Account
      </Button>
    </div>
  );
}
