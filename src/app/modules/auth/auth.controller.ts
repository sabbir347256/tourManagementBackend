import { NextFunction, Request, Response } from "express";
import { catchAsyn } from "../../utilis/catchAsyn";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.services";

const credentialLogin = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo =await authServices.credentialLogin(req.body);

    res.cookie('refreshToken', loginInfo.refreshToken,{
      httpOnly : true,
      secure : false
    })

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User Login Successfully",
      success: true,
      data: loginInfo,
    });
  },
);


const getNewAccessToken = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    const tokenInfo =await authServices.getNewAccessTokenServices(refreshToken as string);


    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User Login Successfully",
      success: true,
      data: tokenInfo,
    });
  },
);

export const AuthController = {
  credentialLogin,
  getNewAccessToken
};
