import { useEffect, useState } from "react";
import { PlaidLink } from "./components/Plaid/PlaidLink";

function App() {
  const [count, setCount] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    async function fetchToken() {
      fetch("http://localhost:8080/api/link", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setToken(data.token));
    }

    fetchToken();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <PlaidLink token={token} userId="123" />
      </header>
    </div>
  );
}

export default App;
