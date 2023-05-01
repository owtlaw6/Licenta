import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import RequestModel from "../models/request";
import UserModel from "../models/user";''
import { assertIsDefined } from "../util/assertIsDefined";

export const getRequests: RequestHandler = async (req, res, next) => {
    try {
        const requests = await RequestModel.find().exec();
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

export const getRequest: RequestHandler = async (req, res, next) => {
    const requestId = req.params.requestId;

    try {
        if (!mongoose.isValidObjectId(requestId)) {
            throw createHttpError(400, "Invalid request id");
        }

        const request = await RequestModel.findById(requestId).exec();

        if (!request) {
            throw createHttpError(404, "Request not found");
        }

        res.status(200).json(request);
    } catch (error) {
        next(error);
    }
};

interface AcceptRequestParams {
    requestId: string,
}

interface AcceptRequestBody {
    username?: string,
    email?: string,
    password?: string,
    role?: string,
}

export const acceptRequest: RequestHandler<AcceptRequestParams, unknown, AcceptRequestBody, unknown> = async (req, res, next) => {
    const requestId = req.params.requestId;
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    try {
        if (!username || !email || !password || !role) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists.");
        }

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: password,
            role: role,
        });

        await newUser.save();
        await RequestModel.findByIdAndDelete(requestId).exec();

        //res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export const deleteRequest: RequestHandler = async (req, res, next) => {
    const requestId = req.params.requestId;
    const authenticatedRequestId = req.session.userId;

    try {
        assertIsDefined(authenticatedRequestId);

        if (!mongoose.isValidObjectId(requestId)) {
            throw createHttpError(400, "Invalid request id");
        }

        const request = await RequestModel.findById(requestId).exec();

        if (!request) {
            throw createHttpError(404, "Request not found");
        }

        await request.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
