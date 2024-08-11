import createHttpError from "http-errors";
import _ from "lodash";
import { comparePaswords } from "../services/hashPassword.js";
import {
  getAccessToken,
  getDecodedToken,
  getRefreshToken,
} from "../services/token.js";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const findUserByUsername = async (username) =>
  await UserModel.findOne({ username });

const findUserByEmail = async (email) => await UserModel.findOne({ email });

export const registerUser = async ({ body }, res, next) => {
  try {
    const user = await findUserByUsername(body.username);
    const email = await findUserByEmail(body.email);

    if (!!user) throw createHttpError(406, "Username already in use");
    if (!!email) throw createHttpError(406, "Email already in use");

    body.name = body.name
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .split(" ")
      .map((x) => _.upperFirst(x))
      .join(" ");
    const newUser = new UserModel(body);
    await newUser.save();

    return res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  { body: { username, password } },
  res,
  next
) => {
  try {
    let user = await findUserByUsername(username);
    if (!user) {
      user = await findUserByEmail(username);
    }
    if (user) {
      const match = await comparePaswords(password, user.password);

      if (match) {
        const refreshToken = getRefreshToken(user);
        if (!user.refreshTokens) {
          user.refreshTokens = [refreshToken];
        } else {
          user.refreshTokens.push(refreshToken);
        }
        await user.save();

        return res.json({
          accessToken: getAccessToken(user),
          refreshToken,
          user,
        });
      }
      throw createHttpError(400, "Invalid Credentials");
    }

    throw createHttpError(400, "User doesn't exists");
  } catch (error) {
    next(error);
  }
};

export const authUser = async ({ headers: { authorization } }, res, next) => {
  try {
    if (authorization) {
      const token = authorization.split(" ")[1];
      const user = getDecodedToken(token);

      if (_.isObject(user)) {
        res.locals.userId = user._id;
        return next();
      } else {
        throw createHttpError(401, "Wrong User Token");
      }
    } else {
      throw createHttpError(401, "No authorization");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      next(error);
    }
  }
};

export const refresh = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!refreshToken) {
    return res.status(401).send("Unauthorized access to refresh token");
  }
  return jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user) => {
      if (err) {
        console.log(err);
        return res.status(401);
      }
      try {
        const userDb = await UserModel.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.status(401);
        }
        const accessToken = getAccessToken(user);
        const newRefreshToken = getRefreshToken(user);
        userDb.refreshTokens.push(newRefreshToken);
        await userDb.save();
        return res.status(200).json({
          accessToken: accessToken,
          refreshToken: newRefreshToken,
        });
      } catch (err) {
        console.log("error while trying to refresh");
        res.sendStatus(500).send("error while trying to refresh");
      }
    }
  );
};

export const logout = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (refreshToken == null) return res.status(401).send("Unauthorized");

  return jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user) => {
      console.log(err);

      if (err) return res.status(401).send("Unauthorized");

      try {
        const userDb = await UserModel.findOne({ _id: user._id });

        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.status(401).send("Unauthorized");
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            (t) => t !== refreshToken
          );
          await userDb.save();
          return res.status(200).send("Logout successful");
        }
      } catch (error) {
        next(error);
      }
    }
  );
};

const client = new OAuth2Client();
export const googleSignin = async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (email != null) {
      let user = await UserModel.findOne({ email: email });
      if (user == null) {
        user = await UserModel.create({
          name: "",
          username: email,
          email: email,
          password: "0",
          image: payload?.picture,
        });
      }

      const refreshToken = getRefreshToken(user);
      if (!user.refreshTokens) {
        user.refreshTokens = [refreshToken];
      } else {
        user.refreshTokens.push(refreshToken);
      }
      conas;
      await user.save();

      return res.json({
        accessToken: getAccessToken(user),
        refreshToken,
        user,
      });
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
