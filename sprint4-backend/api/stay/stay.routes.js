import express from "express";

import {
  requireAuth,
  requireAdmin,
} from "../../middlewares/requireAuth.middleware.js";
import { log } from "../../middlewares/logger.middleware.js";
import {
  getStay,
  getStayById,
  addStay,
  updateStay,
  removeStay,
  addStayReview,
  // removeStayMsg,
} from "./stay.controller.js";

export const stayRoutes = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

stayRoutes.get("/", log, getStay);
stayRoutes.get("/:id", getStayById);
stayRoutes.post("/", requireAuth, addStay);
stayRoutes.put("/:id", requireAuth, updateStay);
stayRoutes.delete("/:id", requireAuth, removeStay);

stayRoutes.post("/:id/review", requireAuth, addStayReview);
// stayRoutes.delete("/:id/msg/:msgId", requireAuth, removeStayMsg);
