import * as yup from "yup";

const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;

const loginSchema = yup.object().shape({
  username: yup.string().min(5).max(30).required("username is required!"),
  password: yup
    .string()
    .matches(passwordPattren, {
      message: "atleast 1 uppercase 1 LowerCase and 1 digit!",
    })
    .required("password is required!"),
});

export default loginSchema;
