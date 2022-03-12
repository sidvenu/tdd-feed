import express from "express";
import pingRouter from "./routes/api/ping";

const app = express();

app.use("/api/ping", pingRouter);

export const port = process.env.PORT || 3000;
export const session = app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
