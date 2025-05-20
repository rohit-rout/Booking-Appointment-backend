import { Router } from "express";
import { addSlot, getSlots } from "../controller/slots.js";

const router = Router();


router.get('/slots', getSlots)
router.post('/slots', addSlot)

export default router;