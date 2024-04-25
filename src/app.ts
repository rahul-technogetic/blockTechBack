import express from 'express'
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from './User/userRouter';
import { config } from './config/config';
import cors from 'cors'

const app = express();

app.use(express.json());

app.use(
    cors({
      origin: config.frontendDomain,
    })
  );

app.get("/", (req, res, next) => {
    res.json({ message: "BlockTech Running" });
});

// api routes

app.use('/api/users',userRouter)

app.use(globalErrorHandler);

export default app;
