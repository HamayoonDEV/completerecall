import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import loginSchema from "../schema/loginSchema";
import Input from "../compnents/inputText/Input";
import { useFormik } from "formik";
import { login } from "../api/internal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/userSlice";

const LoginPage = () => {
  const { error, setError } = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  const handleLogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };
    try {
      const resposne = await login(data);

      if (resposne.status === 200) {
        const user = {
          _id: resposne.data.user._id,
          username: resposne.data.user.username,
          password: resposne.data.user.password,
          auth: resposne.data.auth,
        };
        //udpating the state
        dispatch(setUser(user));
        //navigating to the homePage
        navigate("/");
      } else if (resposne.code === "ERR_BAD_REQUEST") {
        setError(resposne.resposne.data.message);
      }
    } catch (error) {
      return error;
    }
  };
  return (
    <div className={styles.login}>
      <h1>login Page</h1>
      <Input
        type="text"
        name="username"
        placeholder="username"
        value={values.username}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <Input
        type="password"
        name="password"
        placeholder="password"
        value={values.password}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <div className={styles.button}>
        <button onClick={handleLogin} className={styles.loginbutton}>
          Login
        </button>
        <span>
          Don't have account?
          <button
            className={styles.register}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </span>
        <p>{error}</p>
      </div>
    </div>
  );
};

export default LoginPage;
