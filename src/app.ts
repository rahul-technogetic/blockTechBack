import express from 'express'

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
    res.json({ message: "BlockTech Running" });
});

export default app;
