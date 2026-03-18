import appError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import bcrypt from "bcryptjs";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import jwt from 'jsonwebtoken';
import { generateToken } from "../../utilis/jwt";
import { envVars } from "../../config/env";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new appError(httpStatus.BAD_REQUEST, "Email Does not Exits");
  }

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExists.password as string,
  );

  if (!isPasswordMatch) {
    throw new appError(httpStatus.BAD_REQUEST, "InCorrect Password");
  }

  const jwtPayload = {
    email: isUserExists.email,
    userId: isUserExists._id,
    role: isUserExists.role,
  };

  const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES);

  return {
    email: isUserExists.email as string,
    accessToken : accessToken
  };
};

export const authServices = {
  credentialLogin,
};
