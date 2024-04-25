import express from 'express'
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from './User/userRouter';

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
    res.json({ message: "BlockTech Running" });
});

// api routes

app.use('/api/users',userRouter)

app.use(globalErrorHandler);

export default app;
