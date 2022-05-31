import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { UserDashboard } from "./pages/UserDashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Navigation } from "./components/Navigation";
import CookieService from "./services/Cookie/Cookie.service";
import { CookieKeys } from "./shared/constants";

function App() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    setAccessToken(CookieService.getCookie(CookieKeys.AccessToken) ?? "");
  }, []);

  return (
    <main>
      <Navigation accessToken={accessToken} setAccessToken={setAccessToken} />
      <Routes>
        <Route
          path="/login"
          element={<Login setAccessToken={setAccessToken} />}
        />
        <Route
          path="/register"
          element={<Register setAccessToken={setAccessToken} />}
        />
        <Route path="/" element={<UserDashboard accessToken={accessToken} />} />
      </Routes>
    </main>
  );
}

export default App;
