import { config as conf } from "dotenv";
conf();

const _confiq = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_URI,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  frontendDomain: process.env.FRONTEND_DOMAIN,
};

export const config = Object.freeze(_confiq);