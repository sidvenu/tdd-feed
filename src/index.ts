import express from "express";
import pingRouter from "./routes/api/ping";
import feedRouter from "./routes/api/feed";

const app = express();

app.use("/api/ping", pingRouter);
app.use("/api/feed", feedRouter);

export const port = process.env.PORT || 3000;
export const session = app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
