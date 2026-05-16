import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import { useUser, useAuth } from "@clerk/react";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import MyIssues from "./pages/MyIssues";
import { useEffect } from "react";

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const test = async () => {
      if (user) {
        const token = await getToken();
        console.log("TOKEN ONLY:", token);

        const res = await fetch("http://localhost:4000/api/user/data", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);
      }
    };

    test();
  }, [user]);
  // useEffect(() => {
  //   if (user) {
  //     getToken().then((token) => console.log(token));
  //   }
  // }, [user]);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="myissues" element={<MyIssues />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
