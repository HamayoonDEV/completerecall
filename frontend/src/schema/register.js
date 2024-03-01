import * as yup from "yup";

const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
const registerSchema = yup.object().shape({
  name: yup.string().min(5).max(30).required("name is required!"),
  username: yup.string().max(30).required("username is required!"),
  email: yup
    .string()
    .email("Enter a valid Email!")
    .required("Email is required"),
  password: yup
    .string()
    .matches(passwordPattren, {
      message: "atleast 1 uppercase 1 lowercase and 1 digit!",
    })
    .required("password is required!"),
});

export default registerSchema;
