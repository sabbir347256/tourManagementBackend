import { NextFunction, Request, Response } from "express";
import { catchAsyn } from "../../utilis/catchAsyn";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.services";

const credentialLogin = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {


    const loginInfo =await authServices.credentialLogin(req.body);


    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User Login Successfully",
      success: true,
      data: loginInfo,
    });
  },
);

export const AuthController = {
  credentialLogin,
};
