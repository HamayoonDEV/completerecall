import React from "react";
import styles from "./Register.module.css";
import Input from "../../compnents/inputText/Input";
import { setUser } from "../../store/userSlice";
import registerSchema from "../../schema/register";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/internal";
import { useDispatch } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    username: "",
    email: "",
    password: "",
  };
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues,
    validationSchema: registerSchema,
  });
  const handleRegister = async () => {
    const data = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
    };
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        const user = {
          name: response.data.user.name,
          username: response.data.user.username,
          email: response.data.user.email,
          password: response.data.user.password,
          auth: response.data.auth,
        };
        //update the state
        dispatch(setUser(user));
        //navigate to the home page
        navigate("/");
      }
    } catch (error) {
      return error;
    }
  };
  return (
    <div className={styles.register}>
      <Input
        type="text"
        name="name"
        placeholder="name"
        value={values.name}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.name && touched.name ? 1 : undefined}
        errormessage={errors.name}
      />
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
        type="email"
        name="email"
        placeholder="email"
        value={values.email}
        onBlur={handleBlur}
        onChange={handleChange}
        error={errors.email && touched.email ? 1 : undefined}
        errormessage={errors.email}
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
      <button onClick={handleRegister}>Register</button>
      <span>
        Already have an accound?
        <button onClick={() => navigate("/login")}>Login</button>
      </span>
    </div>
  );
};

export default Register;
