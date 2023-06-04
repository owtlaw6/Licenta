import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import RequestModel from "../models/request";
import bcrypt from "bcrypt";
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getDoctors: RequestHandler = async (req, res, next) => {
    try {
        const doctors = await UserModel.find({ role: "Doctor" });
        res.json(doctors);
    } catch (error) {
        console.error("Error getting doctors:", error);
        res.status(500).json({ message: "An error occurred while fetching doctors" });
    }
};

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

interface SignUpRequestBody {
    username?: string,
    email?: string,
    password?: string,
    role?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpRequestBody, unknown> = 
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
            throw createHttpError(400, "Role missing ");
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

        await newRequest.save();

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

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ username: username }).select("+password +email +role").exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
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

export const getAllUsers: RequestHandler = async (req, res, next) => {
    try {
        const users = await UserModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id");
        }

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

interface CreateUserBody {
    username?: string,
    email?: string,
    password?: string,
    role?: string,
}

export const createUser: RequestHandler<unknown, unknown, CreateUserBody, unknown> = async (req, res, next) => {
    const {username, email, password, role} = req.body;
    const passwordRaw = password;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "This username already exists for a user.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "This email is already assigned to a user.");
        }

        if (!username) {
            throw createHttpError(400, "User must have a username");
        }

        if (!email) {
            throw createHttpError(400, "User must have a email");
        }

        if (!passwordRaw) {
            throw createHttpError(400, "User must have a password");
        }

        if (!role) {
            throw createHttpError(400, "User must have a role");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
            role: role,
        });

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface UpdateUserParams {
    userId: string,
}

interface UpdateUserBody {
    username?: string,
    email?: string,
    role?: string,
}

export const updateUser: RequestHandler<UpdateUserParams, unknown, UpdateUserBody, unknown> = 
async (req, res, next) => {
    const userId = req.params.userId;
    const newUsername = req.body.username;
    const newEmail = req.body.email;
    const newRole = req.body.role;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id");
        }

        if (!newUsername) {
            throw createHttpError(400, "User must have a username");
        }
        
        if (!newEmail) {
            throw createHttpError(400, "User must have a email");
        }

        if (!newRole) {
            throw createHttpError(400, "User must have a role");
        }

        const filter = { _id: userId };
        const update = {
            username: newUsername,
            email: newEmail,
            role: newRole,
        };

        const options = { new: true };
        const updatedUser = await UserModel.findOneAndUpdate(filter, update, options).exec();

        if (!updatedUser) {
            throw createHttpError(404, "User not found");
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id");
        }

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        await user.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};