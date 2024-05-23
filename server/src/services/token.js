import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const getAccessToken = user => jwt.sign({ _id: user._id },process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION});

export const getDecodedToken = token => jwt.verify(token, process.env.JWT_SECRET);

export const getRefreshToken = user => jwt.sign({ _id: user._id },  process.env.JWT_REFRESH_SECRET);