import { ACCESS_TOKEN, REFRESH_TOKEN } from "../config/index.js";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/token.js";

class Jwtservices {
  //signAccessToken
  static signAccessToken(payload, expiryTime) {
    return jwt.sign(payload, ACCESS_TOKEN, { expiresIn: expiryTime });
  }
  //signRefreshToken
  static signRefreshToken(payload, expiryTime) {
    return jwt.sign(payload, REFRESH_TOKEN, { expiresIn: expiryTime });
  }
  //verifyAccessToken
  static verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN);
  }
  //verifyRefeshToken
  static verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN);
  }
  //storeRefreshToken
  static async storeRefreshToken(userId, token) {
    try {
      const newToken = new RefreshToken({
        userId,
        token,
      });
      await newToken.save();
    } catch (error) {
      return error;
    }
  }
}

export default Jwtservices;
