import express from "express";

const app = express();

app.get("/ping", (_, res) => {
  res.json({ message: "Pong!" });
});

export const port = process.env.PORT || 3000;
export const session = app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
