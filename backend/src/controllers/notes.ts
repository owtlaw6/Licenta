import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/note";
import UserModel from "../models/user";
import PatientModel from "../models/patient";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const authenticatedUser = await UserModel.findById(authenticatedUserId).exec();
        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }
        
        if (authenticatedUser.role === "Doctor") {
            const notes = await NoteModel.find({ doctor: authenticatedUser.username }).exec();
            res.status(200).json(notes);
        } else if (authenticatedUser.role === "Technician") {
            const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
            res.status(200).json(notes);
        } else if (authenticatedUser.role === "Admin") {
            res.status(200).json([]);
        } else if (authenticatedUser.role === "Assistant") {
            const patient = await PatientModel.find().exec();
            res.status(200).json(patient);
        } else {
            throw createHttpError(403, "You don't have permission to perform this action");
        }
    } catch (error) {
        next(error);
    }
};

export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

interface CreateNoteBody {
    title?: string,
    text?: string,
    doctor?: string,
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const doctor = req.body.doctor;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }

        if (!doctor) {
            throw createHttpError(400, "Note must have a doctor");
        }

        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
            doctor: doctor,
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};

interface UpdateNoteParams {
    noteId: string,
}

interface UpdateNoteBody {
    title?: string,
    text?: string,
    doctor?: string,
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const newDoctor = req.body.doctor;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        if (!newTitle) {
            throw createHttpError(400, "Note must have a title");
        }

        if (!newDoctor) {
            throw createHttpError(400, "Note must have a doctor");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        note.title = newTitle;
        note.text = newText;
        note.doctor = newDoctor;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        await note.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};