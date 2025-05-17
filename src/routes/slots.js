import { Router } from "express";
import { getSlots } from "../controller/slots.js";

const router = Router();


router.get('/', getSlots)

export default router;