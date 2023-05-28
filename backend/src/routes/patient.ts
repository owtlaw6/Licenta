import express from "express";
import * as PatientController from "../controllers/patient";

const router = express.Router();

router.get("/", PatientController.getPatients);

router.get("/:patientId", PatientController.getPatient);

router.post("/", PatientController.createPatient);

router.patch("/:patientId", PatientController.updatePatient);

router.delete("/:patientId", PatientController.deletePatient);

router.get("/view-patient/:patientId", PatientController.viewPatient);

router.get("/patientNoduleData/:patientCnp", PatientController.getPatientNoduleData);

export default router;