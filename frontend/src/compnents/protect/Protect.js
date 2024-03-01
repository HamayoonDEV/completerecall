import { Navigate } from "react-router-dom";

const Protect = ({ isAuth, children }) => {
  if (isAuth) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Protect;
