import styled from "@emotion/styled";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import CookieService from "../services/Cookie/Cookie.service";
import { CookieKeys } from "../shared/constants";

interface Props {
  accessToken: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
}

export function Navigation({ accessToken, setAccessToken }: Props) {
  function logout() {
    CookieService.removeCookie(CookieKeys.AccessToken);
    setAccessToken("");
  }

  return (
    <nav>
      <ListContainer>
        {accessToken && (
          <Link to="/">
            <ListItem>Home</ListItem>
          </Link>
        )}
        {accessToken ? (
          <Link to="/login" onClick={logout}>
            <ListItem>Logout</ListItem>
          </Link>
        ) : (
          <Link to="/login">
            <ListItem>Login</ListItem>
          </Link>
        )}
      </ListContainer>
    </nav>
  );
}

const ListContainer = styled.ul({
  display: "flex",
  gap: "10px",
  listStyle: "none",
});

const ListItem = styled.li({});
