import express from "express";
import * as PatientController from "../controllers/patient";

const router = express.Router();

router.get("/", PatientController.getPatients);

router.get("/:PatientId", PatientController.getPatient);

router.post("/", PatientController.createPatient);

router.patch("/:PatientId", PatientController.updatePatient);

router.delete("/:PatientId", PatientController.deletePatient);

export default router;