import { Dispatch } from "react";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";
import { Button } from "@chakra-ui/react";
import CookieService from "../services/Cookie/Cookie.service";
import { CookieKeys } from "../shared/constants";
import { useNavigate } from "react-router-dom";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

interface Props {
  setAccessToken: Dispatch<string>;
}

export function Login({ setAccessToken }: Props) {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
  }>();

  function onSubmit({ email, password }: { email: string; password: string }) {
    fetch(`${import.meta.env.VITE_SERVER_HOST}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => res.json())
      //TODO type this
      .then(({ data: { user } }) => {
        CookieService.setCookie(CookieKeys.AccessToken, user.accessToken);

        setAccessToken(user.accessToken);

        navigate("/", { replace: true });
      })
      .catch((error) => console.error("Login error: ", error));
  }

  return (
    <Container onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="email">Email address</FormLabel>
        <Input
          id="email"
          type="email"
          {...register("email", { required: "Required" })}
        />
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          id="password"
          type="password"
          {...register("password", { required: "Required" })}
        />
      </FormControl>
      <Button type="submit">Login Button</Button>
    </Container>
  );
}

const Container = styled.form({
  display: "flex",
  flexDirection: "column",
  maxWidth: 300,
});
