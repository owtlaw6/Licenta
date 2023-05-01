import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import RequestModel from "../models/request";

export const getAllRequests: RequestHandler = async (req, res, next) => {
    try {
        const requests = await RequestModel.find().exec();
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

export const approveRequest: RequestHandler = async (req, res, next) => {
    const requestId = req.params.requestId;

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    try {
        const request = await RequestModel.findById(requestId).exec();

        if (!request) {
            throw createHttpError(404, "Request not found");
        }

        if (!username || !email || !password || !role){
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "Email already taken.");
        }

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: password,
            role: role,
        });

        await newUser.save();
        await RequestModel.findByIdAndDelete(requestId).exec();

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export const denyRequest: RequestHandler = async (req, res, next) => {
    const requestId = req.params.requestId;

    try {
        const request = await RequestModel.findById(requestId).exec();

        if (!request) {
            throw createHttpError(404, "Note not found");
        }

        await request.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};