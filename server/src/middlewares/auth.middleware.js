import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if ( req.headers.authorization && req.headers.authorization.startsWith("bearer") ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("token", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(decoded._id);

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
