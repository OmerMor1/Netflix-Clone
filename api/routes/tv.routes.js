import express from "express";
import {
  getTrendingTv,
  getTvTrailers,
  getTvDetails,
  getSimilaTvs,
  getTvByCategory,
} from "../controllers/tv.controller.js";
const router = express.Router();

router.get("/trending", getTrendingTv);
router.get("/:id/trailers", getTvTrailers);
router.get("/:id/details", getTvDetails);
router.get("/:id/similar", getSimilaTvs);
router.get("/:category", getTvByCategory);

export default router;
