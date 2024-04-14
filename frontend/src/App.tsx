import "./App.css";
import { Route, Switch } from "react-router-dom";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import { getAudioBooks, getUser } from "./utils/audiobook";
import Navbar from "./components/Navbar";
function App() {
  interface User {
    id: string;
    loginStatus: boolean;
    profilePic?: string;
  }

  const account = window.walletConnection.account();
  const [audioBooks, setAudioBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({ id: "", loginStatus: false });

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("loginStatus");
    if (storedLoginStatus) {
      setUser({ id: "", loginStatus: true });
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (!account.accountId) return;
        const responseUser = await getUser(account.accountId);
        setUser(responseUser);
        const responseAudioBooks = await getAudioBooks();
        setAudioBooks(responseAudioBooks);
        if(responseUser === null) return;
        localStorage.setItem("loginStatus", responseUser.loginStatus ? "true" : "false"); // Store login status in local storage
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [account.accountId]);

  return (
    <>
      <Navbar user={user} />
      <Switch>
        <Route
          exact
          path="/"
          render={() =>
            user && user.loginStatus ? (
              <Home loading={loading} audioBooks={audioBooks} user={user}/>
            ) : (
              <Login account={account} />
            )
          }
        />
        <Route
          path="/login"
          render={() =>
            user && user.loginStatus ? (
              <Home loading={loading} audioBooks={audioBooks} user={user}/>
            ) : (
              <Login account={account} />
            )
          }
        />
        <Route
          path="/profile"
          render={() =>
            user && user.loginStatus ? (
              <Profile
                accountName={account.accountId}
                loading={loading}
                audioBooks={audioBooks}
                user={user}
              />
            ) : (
              <Login account={account} />
            )
          }
        />
      </Switch>
    </>
  );
}

export default App;
