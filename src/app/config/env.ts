import dotenv from 'dotenv';

dotenv.config();

export const envVars  = {
    PORT : process.env.PORT as string,
    DB_URL : process.env.DB_URL as string,
    NODE_ENV : process.env.NODE_ENV as string,
    JWT_ACCESS_SECRET : process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES : process.env.JWT_ACCESS_EXPIRES as string,
    BCRYPT_SALT_ROUND : process.env.BCRYPT_SALT_ROUND as string,
    SUPER_ADMIN_EMAIL : process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD : process.env.SUPER_ADMIN_PASSWORD as string,
    JWT_REFRESH_SECRET : process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES : process.env.JWT_REFRESH_EXPIRES as string
} 