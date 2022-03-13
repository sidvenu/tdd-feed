import express from "express";
import * as feedController from "../../controllers/feed";

const router = express.Router();
router.get("/", feedController.get);

export default router;
