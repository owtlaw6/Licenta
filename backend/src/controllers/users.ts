import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import RequestModel from "../models/request"
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
    role?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = 
async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;
    const role = req.body.role;

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        if (!role) {
            throw createHttpError(400, "Role missing " + req.body.role);
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newRequest = await RequestModel.create({
            username: username,
            email: email,
            password: passwordHashed,
            role: role,
        });

        //req.session.userId = newRequest._id;

        res.status(201).json(newRequest);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string,
    password?: string,
    role?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        if (!role) {
            throw createHttpError(400, "Role missing");
        }

        const user = await UserModel.findOne({ username: username }).select("+password +email +role").exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        if (role != user.role) {
            throw createHttpError(401, "Wrong role");
        }

        req.session.userId = user._id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};