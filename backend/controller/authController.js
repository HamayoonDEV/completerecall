import Joi from "joi";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Jwtservices from "../services/Jwtservices.js";
import RefreshToken from "../models/token.js";

const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
const authController = {
  //register user method
  async registerUser(req, res, next) {
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, name, email, password } = req.body;

    //password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    //handle email and username confilct
    try {
      const usernameInUse = await User.exists({ username });
      const emailInuse = await User.exists({ email });
      if (usernameInUse) {
        const error = {
          status: 401,
          message: "username is already in use!",
        };
        return next(error);
      }
      if (emailInuse) {
        const error = {
          status: 401,
          message: "email is already in use!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //save the detail in database
    let user;
    try {
      const newUserRegister = new User({
        username,
        name,
        email,
        password: hashedPassword,
      });
      user = await newUserRegister.save();
    } catch (error) {
      return next(error);
    }
    //genrating tokens
    const accessToken = Jwtservices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = Jwtservices.signRefreshToken({ _id: user._id }, "60m");
    await Jwtservices.storeRefreshToken(user._id, refreshToken);
    //sending cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //sending response
    res.status(201).json({ user, auth: true });
  },
  //user login method
  async login(req, res, next) {
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    const { error } = userLoginSchema.validateAsync(req.body);
    if (error) {
      return next(error);
    }
    const { username, password } = req.body;

    //username & password verification
    let user;
    try {
      user = await User.findOne({ username });
      if (!user) {
        const error = {
          status: 409,
          message: "invalid username!",
        };
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = {
          status: 409,
          message: "invalid password!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    const accessToken = Jwtservices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = Jwtservices.signRefreshToken({ _id: user._id }, "60m");
    //update tokens to the database
    try {
      RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }
    //sending tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //sending response
    res.status(200).json({ user, auth: true });
  },
  //logout method
  async logout(req, res, next) {
    const { refreshToken } = req.cookies;
    //delete refreshToken from database
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }
    //clearCookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    //sending response
    res.status(200).json({ user: null, auth: false });
  },
  //refresh method
  async refresh(req, res, next) {
    const originalRefreshToken = req.cookies.refreshToken;
    //verify refreshToken
    let id;
    try {
      id = await Jwtservices.verifyRefreshToken(originalRefreshToken)._id;
    } catch (error) {
      const e = {
        status: 401,
        message: "unAuthorized!",
      };
      return next(e);
    }

    //verify the tokens from database
    // try {
    //   const match = await RefreshToken.findOne(
    //     { _id: id },
    //     { token: originalRefreshToken }
    //   );
    //   console.log(id);
    //   console.log(originalRefreshToken);
    //   console.log(match);
    //   if (!match) {
    //     const error = {
    //       status: 401,
    //       message: "unAuthorized!!",
    //     };
    //     return next(error);
    //   }
    // } catch (error) {
    //   return next(error);
    // }
    //gerrate new Tokens
    const accessToken = Jwtservices.signAccessToken({ _id: id }, "30m");
    const refreshToken = Jwtservices.signRefreshToken({ _id: id }, "60m");

    //update refreshToken to the database
    try {
      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });
    } catch (error) {
      return next(error);
    }
    //sending cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //find the user
    const user = await User.findOne({ _id: id });
    //sending response
    res.status(200).json({ user, auth: true });
  },
};

export default authController;
