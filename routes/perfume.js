import express from "express";
import {
  createPerfume,
  getPerfumes,
  getPerfume,
  updatePerfume,
  deletePerfume,
} from "../controllers/perfume.js"; 
import {
  createPerfumeValidator,
  updatePerfumeValidator,
} from "../validators/perfume.js"; 
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", upload.single('image'), createPerfumeValidator, createPerfume);
router.get("/", getPerfumes);
router.get("/:id", getPerfume);
router.put("/:id", upload.single('image'), updatePerfumeValidator, updatePerfume);
router.delete("/:id", deletePerfume);

export default router;
