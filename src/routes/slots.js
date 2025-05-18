import { Router } from "express";
import { getSlots } from "../controller/slots.js";

const router = Router();


router.get('/slots', getSlots)

export default router;