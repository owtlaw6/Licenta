import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import UserModel from "../models/user";
import PatientModel from "../models/patient";
import { assertIsDefined } from "../util/assertIsDefined";

export const getPatients: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const authenticatedUser = await UserModel.findById(authenticatedUserId).exec();
        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }
        
        if (authenticatedUser.role === "Assistant") {
            const patient = await PatientModel.find().exec();
            res.status(200).json(patient);
        } else {
            throw createHttpError(403, "You don't have permission to perform this action");
        }
    } catch (error) {
        next(error);
    }
};

export const getPatient: RequestHandler = async (req, res, next) => {
    const patientId = req.params.patientId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(patientId)) {
            throw createHttpError(400, "Invalid patient id");
        }

        const patient = await PatientModel.findById(patientId).exec();

        if (!patient) {
            throw createHttpError(404, "Patient not found");
        }

        res.status(200).json(patient);
    } catch (error) {
        next(error);
    }
};

interface CreatePatientBody {
    name?: string,
    cnp?: string,
    doctor?: string,
}

export const createPatient: RequestHandler<unknown, unknown, CreatePatientBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const cnp = req.body.cnp;
    const doctor = req.body.doctor;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!name) {
            throw createHttpError(400, "Patient must have a name");
        }

        if (!cnp) {
            throw createHttpError(400, "Patient must have a CNP");
        }

        if (!doctor) {
            throw createHttpError(400, "Patient must have a doctor");
        }

        const newPatient = await PatientModel.create({
            name: name,
            cnp: cnp,
            doctor: doctor,
        });

        res.status(201).json(newPatient);
    } catch (error) {
        next(error);
    }
};

interface UpdatePatientParams {
    patientId: string,
}

interface UpdatePatientBody {
    name?: string,
    cnp?: string,
    doctor?: string,
}

export const updatePatient: RequestHandler<UpdatePatientParams, unknown, UpdatePatientBody, unknown> = async (req, res, next) => {
    const patientId = req.params.patientId;
    const newName = req.body.name;
    const newCnp = req.body.cnp;
    const newDoctor = req.body.doctor;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(patientId)) {
            throw createHttpError(400, "Invalid patient id");
        }

        if (!newName) {
            throw createHttpError(400, "Patient must have a name");
        }
        
        if (!newCnp) {
            throw createHttpError(400, "Patient must have a CNP");
        }

        if (!newDoctor) {
            throw createHttpError(400, "Patient must have a doctor");
        }

        const patient = await PatientModel.findById(patientId).exec();

        if (!patient) {
            throw createHttpError(404, "Patient not found");
        }

        patient.name = newName;
        patient.cnp = newCnp;
        patient.doctor = newDoctor;

        const updatedPatient = await patient.save();

        res.status(200).json(updatedPatient);
    } catch (error) {
        next(error);
    }
};

export const deletePatient: RequestHandler = async (req, res, next) => {
    const patientId = req.params.patientId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(patientId)) {
            throw createHttpError(400, "Invalid patient id");
        }

        const patient = await PatientModel.findById(patientId).exec();

        if (!patient) {
            throw createHttpError(404, "Patient not found");
        }

        await patient.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};