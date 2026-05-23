import express from "express";
import { getAllStats, getHabitStats, getHeatmap, getRange, getToday, markComplete, unMarkComplete } from "../controllers/logController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router()

router.use(protect)

router.post('/', markComplete);
router.delete('/', unMarkComplete);

router.get('/today', getToday);
router.get('/range', getRange);
router.get('/heatmap', getHeatmap);
router.get('/stats', getAllStats);
router.get('/stats/:habitId', getHabitStats)


export default router;