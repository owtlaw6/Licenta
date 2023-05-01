import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";

export const requiresAuth: RequestHandler = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        next(createHttpError(401, "User not authenticated"));
    }
};

export const requiresAdmin: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        const user = await UserModel.findById(authenticatedUserId).exec();

        if (user && user.role === "Admin") {
            next();
        } else if (user && user.role === "admin") {
            next();
        } else{
            next(createHttpError(403, "You don't have permission to perform this action"));
        }
    } catch (error) {
        next(error);
    }
};