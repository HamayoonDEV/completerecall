import Jwtservices from "../services/Jwtservices.js";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    const error = {
      status: 401,
      message: "unAuthrozied!",
    };
    return next(error);
  }
  //verify accessToken
  let id;
  try {
    id = Jwtservices.verifyAccessToken(accessToken)._id;
  } catch (error) {
    return next(error);
  }
  //find user
  let user;
  try {
    user = await User.findOne({ _id: id });
    if (!user) {
      const error = {
        status: 404,
        message: "user not found!",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
  req.user = user;
  next();
};
export default auth;
