import React from "react";
import styles from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signout } from "../../api/internal";
import { reSetUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.user.auth);
  const username = useSelector((state) => state.user.username);
  const handleSignOut = async () => {
    await signout();
    //update the state
    dispatch(reSetUser());
    //navigate to the home page
    navigate("/");
  };

  return (
    <div className={styles.navbar}>
      {username ? (
        <h2 onClick={() => navigate("/")}>{username}</h2>
      ) : (
        <h2>username</h2>
      )}

      <span onClick={() => navigate("createpost")}>Posts</span>
      {isAuth ? (
        <button className={styles.signout} onClick={handleSignOut}>
          signOut
        </button>
      ) : (
        <button className={styles.login} onClick={() => navigate("login")}>
          Login
        </button>
      )}
      <button className={styles.posts} onClick={() => navigate("viewpost")}>
        View Posts
      </button>
    </div>
  );
};

export default Navbar;
