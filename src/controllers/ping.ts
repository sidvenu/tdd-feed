import express from "express";
import * as pingService from "../services/ping";

export const get = async (_: express.Request, res: express.Response) => {
  res.json(pingService.getPing());
};
