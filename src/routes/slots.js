import { Router } from "express";
import { addSlot, getSlots, getSlotsByDate } from "../controller/slots.js";

const router = Router();


router.get('/slots', getSlots)
router.get('/slots/all', getSlotsByDate)
router.post('/slots', addSlot)

export default router;