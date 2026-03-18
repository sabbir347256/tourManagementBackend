import appError from "../../errorHelpers/appError";
import { IsActive, IUser } from "../user/user.interface";
import bcrypt from "bcryptjs";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateToken, verifyToken } from "../../utilis/jwt";
import { envVars } from "../../config/env";
import { createUserToken } from "../../utilis/userToken";

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

  // const jwtPayload = {
  //   email: isUserExists.email,
  //   userId: isUserExists._id,
  //   role: isUserExists.role,
  // };

  // const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES);
  // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES);

  const userTokens =await createUserToken(isUserExists);

  const {password: pass , ...rest} = isUserExists.toObject();

  return {
    email: isUserExists.email as string,
    accessToken : userTokens.accessToken,
    refreshToken : userTokens.refreshToken,
    user : rest
  };
};

const getNewAccessTokenServices = async (refreshToken : string) => {
  const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

  const isUserExists = await User.findOne({ email : verifiedToken.email });

  if (!isUserExists) {
    throw new appError(httpStatus.BAD_REQUEST, "User Does not Exits");
  }

  if (isUserExists.isActive === IsActive.BLOCKED) {
    throw new appError(httpStatus.BAD_REQUEST, "User is Blocked");
  }
  if (isUserExists.isDeleted) {
    throw new appError(httpStatus.BAD_REQUEST, "User is Deleted");
  };


  const jwtPayload = {
    email: isUserExists.email,
    userId: isUserExists._id,
    role: isUserExists.role,
  };

  const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES);

  return {
    accessToken
  };
};

export const authServices = {
  credentialLogin,
  getNewAccessTokenServices
};
