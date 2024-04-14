import {
  Box,
  Button,
  Container,
  HStack,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { login, register } from "../utils/audiobook";

interface LoginProps {
  account: any;
}
const Login = (props: LoginProps) => {
  const [loginText, setLoginText] = useState("Don't have an account?");
  const [signText, setSignText] = useState("Sign up");
  const [loginButton, setLoginButton] = useState("Sign in");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const account = props.account;

  const history = useHistory();
  const signup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (loginText === "Don't have an account?" && signText === "Sign up") {
      setLoginText("Already have an account?");
      setSignText("Sign in");
      setLoginButton("Sign up");
    }

    if (loginText === "Already have an account?" && signText === "Sign in") {
      setLoginText("Don't have an account?");
      setSignText("Sign up");
      setLoginButton("Sign in");
    }
  };

  const loginHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!account.accountId) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      if (loginButton === "Sign in") {
        const response = await login();
        toast({
          title: response === "Logged in successfully" ? "Success" : "Error",
          description: response,
          status: response === "Logged in successfully" ? "success" : "error",
          duration: 3000,
          isClosable: true,
        });
        history.push("/profile");
        if (response === "Logged in successfully") {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        const response = await register();
        toast({
          title:
            response === "User registered successfully" ? "Success" : "Error",
          description: response,
          status:
            response === "User registered successfully" ? "success" : "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <img src={"/logo.svg"} alt="logo" style={{ height: "100px" }} />
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <p>Connect Wallet to continue</p>
            <Text color="fg.muted" id="login-text">
              {loginText}
              <Link
                _focus={{ boxShadow: "none" }}
                href="#"
                onClick={(e) => signup(e)}
              >
                {" "}
                {signText}
              </Link>
            </Text>
          </Stack>
        </Stack>
        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={{ base: "transparent", sm: "bg.surface" }}
          borderRadius={{ base: "none", sm: "xl" }}
          // backgroundColor={"purple.200"}
        >
          <Stack spacing="6">
            <HStack justify="space-between"></HStack>
            <Stack spacing="6">
              <Button
                isLoading={loading}
                loadingText="Please wait..."
                id="login-button"
                _hover={{
                  bg: "purple.300",
                  transition: "background-color ease-in 0.5s",
                }}
                onClick={loginHandler}
              >
                {loginButton}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
export default Login;
