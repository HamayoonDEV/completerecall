import "./App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Navbar from "./compnents/Navbar/Navbar";
import LoginPage from "./pages/LoginPage";
import CreatePosts from "./pages/CreatePosts/CreatePosts";
import ViewPosts from "./pages/viewPost/ViewPosts";
import PostDetail from "./pages/postDetail/postDetail";
import Protect from "./compnents/protect/Protect";
import UpdatePost from "./pages/updatePost/UpdatePost";
import { useSelector } from "react-redux";
import Register from "./pages/Register/Register";

function App() {
  const isAuth = useSelector((state) => state.user.auth);
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="login" exact element={<LoginPage />} />
        <Route
          path="createpost"
          exact
          element={
            <Protect isAuth={isAuth}>
              <CreatePosts />
            </Protect>
          }
        />
        <Route
          path="viewpost"
          exact
          element={
            <Protect isAuth={isAuth}>
              <ViewPosts />
            </Protect>
          }
        />
        <Route path="post/:id" exact element={<PostDetail />} />
        <Route path="post/update/:id" exact element={<UpdatePost />} />
        <Route path="register" exact element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
