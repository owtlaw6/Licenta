import { ObjectId, InferSchemaType, Schema, model } from "mongoose";

const requestSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
});

type Request = InferSchemaType<typeof requestSchema> & { _id: ObjectId };

export default model<Request>("Request", requestSchema);