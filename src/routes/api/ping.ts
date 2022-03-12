import express from "express";
import * as pingController from "../../controllers/ping";

const router = express.Router();
router.get("/", pingController.get);

export default router;
