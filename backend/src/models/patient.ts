import { InferSchemaType, model, Schema } from "mongoose";

const patientSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    cnp: { type: String, required: true },
    doctor: { type: String, required: true },
}, { timestamps: true });

type Patient = InferSchemaType<typeof patientSchema>;

export default model<Patient>("Patient", patientSchema);