import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
// import CreatePost from "./pages/CreatePost";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import { useUser, useAuth } from "@clerk/react";
import Layout from "./pages/Layout";
import toast, { Toaster } from "react-hot-toast";
import MyIssues from "./pages/MyIssues";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/citizen/userSlice";
import CreatePostNew from "./pages/CreatePostNew";

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token));
      }
    };
    fetchData();
  }, [user, getToken, dispatch]);

  // useEffect(() => {
  //   const test = async () => {
  //     if (user) {
  //       const token = await getToken();

  //       const res = await fetch("http://localhost:4000/api/user/data", {
  //         credentials: "include",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const data = await res.json();
  //       console.log("USER DATA:", data);
  //     }
  //   };
  //
  //   test();
  // }, [user]);
  //===+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
          <Route path="create-post-new" element={<CreatePostNew />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
{
  /* <Route path="/report-issue" element={<IssueCategorySelection />} />
          <Route path="/issue-details" element={<IssueDetailsUpload />} />
          <Route
            path="/ai-department-suggestion"
            element={<AIDepartmentSuggestion />}
          /> */
}
