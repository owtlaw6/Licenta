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
        } else if (authenticatedUser.role === "Doctor") {
            const patient = await PatientModel.find({
                doctors: {
                    $in: [authenticatedUserId],
                },
            }).exec();
            res.status(200).json(patient);
        } else if (authenticatedUser.role === "Technician") {
            const patient = await PatientModel.find().exec();
            res.status(200).json(patient);
        } else if (authenticatedUser.role === "Admin") {
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
    doctors?: string[],
    description?: string,
}

export const createPatient: RequestHandler<unknown, unknown, CreatePatientBody, unknown> = async (req, res, next) => {
    const {name, cnp, doctors, description} = req.body
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const existingPatient = await PatientModel.findOne({ cnp: cnp }).exec();

        if (existingPatient) {
            throw createHttpError(409, "CNP already exists for a patient.");
        }

        if (!name) {
            throw createHttpError(400, "Patient must have a name");
        }

        if (!cnp) {
            throw createHttpError(400, "Patient must have a CNP");
        }

        if (cnp.length !== 13 || !(/^[0-9]+$/.test(cnp))) {
            throw createHttpError(400, "Wrong CNP");
        }

        if (!doctors) {
            throw createHttpError(400, "Patient must have a doctor");
        }

        const newPatient = await PatientModel.create({
            name: name,
            cnp: cnp,
            doctors: doctors,
            description: description,
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
    doctors?: string[],
    description?: string,
}

export const updatePatient: RequestHandler<UpdatePatientParams, unknown, UpdatePatientBody, unknown> = 
async (req, res, next) => {
    const patientId = req.params.patientId;
    const newName = req.body.name;
    const newCnp = req.body.cnp;
    const newDoctors = req.body.doctors;
    const newDescription = req.body.description;
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

        if (newCnp.length !== 13 || !(/^[0-9]+$/.test(newCnp))) {
            throw createHttpError(400, "Wrong CNP");
        }

        if (!newDoctors) {
            throw createHttpError(400, "Patient must have a doctor");
        }

        const filter = { _id: patientId };
        const update = {
            name: newName,
            cnp: newCnp,
            doctors: newDoctors,
            description: newDescription,
        };

        const options = { new: true };
        const updatedPatient = await PatientModel.findOneAndUpdate(filter, update, options).exec();

        if (!updatedPatient) {
            throw createHttpError(404, "Patient not found");
        }

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