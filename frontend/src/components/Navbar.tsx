import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Img,
  Stack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { login, logout, accountBalance } from "../utils/near";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

interface User {
  id: string;
  loginStatus: boolean;
  profilePic?: string;
}

const Navbar = ({ user }: { user: User }) => {

  const account = window.walletConnection.account();
  const [balance, setBalance] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const location = useLocation();
  const getAccountBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(parseFloat(await accountBalance()));
    }
  }, [account.accountId]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem('loginStatus');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoggingOut(false);
      history.replace("/login");
      window.location.reload();
    }
  };

  let refresh = localStorage.getItem("refresh");
  useEffect(() => {
    if (refresh === "true") {
      localStorage.setItem("refresh", "false");
      window.location.reload();
    }
  }, [refresh]);

  const setRefreshFlag = () => {
    localStorage.setItem("refresh", "true");
  };

  useEffect(() => {
    getAccountBalance();
  }, [getAccountBalance]);

  return (
    <>
      <Box bg={useColorModeValue("purple.300", "purple.400")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Box height={10} w={10} onClick={() => history.push("/")}>
              <Img src="/logo.svg" alt="logo" />
            </Box>
          </HStack>
          <Flex alignItems={"center"}>
            {!account.accountId ? (
              location.pathname === "/login" ? (
                <Button
                  id="login-button"
                  _hover={{
                    bg: "purple.200",
                    transition: "background-color ease-in 0.5s",
                  }}
                  onClick={() => {
                    login();
                    setRefreshFlag();
                  }}
                >
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  id="login-button"
                  _hover={{
                    bg: "purple.200",
                    transition: "background-color ease-in 0.5s",
                  }}
                  onClick={() => history.push("/login")}
                >
                  Login
                </Button>
              )
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={
                      user && user.loginStatus ? user.profilePic : ""
                    }
                  />
                </MenuButton>
                <MenuList padding={0}>
                  <MenuItem
                    cursor={"pointer"}
                    onClick={() => history.push("/profile")}
                    _hover={{ bg: "none" }}
                  >
                    {" "}
                    Account: {account.accountId}{" "}
                  </MenuItem>
                  <Divider />
                  <MenuItem cursor={"default"} _hover={{ bg: "none" }}>
                    Balance: {balance} NEAR
                  </MenuItem>
                  <Divider />
                  <Stack direction="row" align="center" justify="center">
                    <Button
                      w="100%"
                      bottom="0"
                      isLoading={loggingOut}
                      loadingText="Logging out"
                      onClick={handleLogout}
                      disabled={loggingOut}
                    >
                      Logout
                    </Button>
                  </Stack>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
