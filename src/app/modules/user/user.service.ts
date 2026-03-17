import bcrypt from "bcryptjs";
import appError from "../../errorHelpers/appError";
import { IsAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes';

const createUser = async (payload: Partial<IUser>) => {
  const { email ,password, ...rest} = payload;

  const isUserExist =await User.findOne({email});

  if(isUserExist){
    throw new appError(httpStatus.BAD_REQUEST, 'User Allready Exist');
  };

  const hashedPassword = await bcrypt.hash(password as string,10);

//   const isPasswordMatch = await bcrypt.compare(password as string,hashedPassword);

  const authProvider : IsAuthProvider = {provider: 'credentials', providerID : email as string};

  const user = await User.create({
    email,
    auths : [authProvider],
    password : hashedPassword, 
    ...rest
  });
  return user;
};

const getAllUsers = async() => {
    const users =await User.find({});

    const totalUsers = await User.countDocuments();

    return {
        data : users,
        meta :   {
            total : totalUsers
        }
    }
}

export const userService ={
    createUser,
    getAllUsers
}
