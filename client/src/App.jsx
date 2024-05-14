import { useContext, useEffect, useState } from "react";
import "./App.css";

import Home from "./views/Home.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import AllPosts from "./views/AllPosts.jsx";
import CreatePost from "./views/CreatePost.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./views/NotFound.jsx";
import SinglePost from "./views/SinglePost.jsx";
import Login from "./views/Login.jsx";
import Authenticated from "./hoc/Authenticated.jsx";
import { AppContext } from "./context/AppContext.jsx";
import Register from "./views/Register.jsx";
import { getUserData } from "./services/users.service.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase-config.js";
import DeletedPosts from "./views/DeletedPosts"; // Import the DeletedPosts component
import UserSearch from "./views/UserSearch.jsx";
import ProfilePage from "./views/UserProfile.jsx";
import UserList from "./views/UserProfile.jsx";
import UserPage from "./views/ProfilePage.jsx";
import FilteredByComments from "./components/Sort-and-filter/FilteredByComments.jsx";
import FilteredByLikes from "./components/Sort-and-filter/FilteredByLikes.jsx";
import SortedByAuthor from "./components/Sort-and-filter/SortedByAuthor.jsx";
import SortedByDate from "./components/Sort-and-filter/SortedByDate.jsx";
import RestrictedHeader from "./RestrictedHeader.jsx";
import Blocked from "./views/Blocked.jsx";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({ ...appState, user });
  }

  useEffect(() => {
    if (!appState.user) return;

    getUserData(appState.user.uid).then((snapshot) => {
      const userData = Object.values(snapshot.val())[0];
      setAppState({ ...appState, userData });
      // console.log(snapshot.val()); // { pesho: {...} }
      // console.log(userData);
    });
  }, [appState.user]);

  return (
    <>
      <div>
        <img
          src="svg/532.png"
          alt=""
          style={{
            width: "114%",
            position: "absolute",
            right: "-4%",
            bottom: "-54%",
            zIndex: "-1",
          }}
        />
      </div>
      <BrowserRouter>
        <AppContext.Provider value={{ ...appState, setAppState }}>
          {appState.userData && (
            <>
              {appState.userData.isBlocked ? (
                <RestrictedHeader userData={appState.userData} />
              ) : (
                <Header />
              )}
            </>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/posts"
              element={
                <Authenticated>
                  <AllPosts />
                </Authenticated>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <Authenticated>
                  <SinglePost />
                </Authenticated>
              }
            />
            <Route
              path="/posts-create"
              element={
                <Authenticated>
                  <CreatePost />
                </Authenticated>
              }
            />
            <Route
              path="/deleted"
              element={
                <Authenticated>
                  <DeletedPosts />
                </Authenticated>
              }
            />
            <Route
              path="/user-search"
              element={
                <Authenticated>
                  <UserSearch />
                </Authenticated>
              }
            />
            <Route
              path="/my-profile"
              element={
                <Authenticated>
                  <UserList />
                </Authenticated>
              }
            />
            <Route
              path="/user/:handle"
              element={
                <Authenticated>
                  <UserPage />
                </Authenticated>
              }
            />
            <Route
              path="/filtered-by-comments"
              element={
                <Authenticated>
                  <FilteredByComments />
                </Authenticated>
              }
            />
            <Route
              path="/filtered-by-likes"
              element={
                <Authenticated>
                  <FilteredByLikes />
                </Authenticated>
              }
            />
            <Route
              path="/sorted-by-author"
              element={
                <Authenticated>
                  <SortedByAuthor />
                </Authenticated>
              }
            />
            <Route
              path="/sorted-by-date"
              element={
                <Authenticated>
                  <SortedByDate />
                </Authenticated>
              }
            />

            <Route path="*" element={<NotFound />} />
            <Route path="/blocked" element={<Blocked />} />
          </Routes>
          <Footer />
        </AppContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
