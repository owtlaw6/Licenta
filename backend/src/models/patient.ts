import { InferSchemaType, model, Schema } from "mongoose";

const patientSchema = new Schema({
    name: { type: String, required: true },
    cnp: { type: String, required: true },
    doctors: [{type: Schema.Types.ObjectId, ref: 'User'}]
}, { timestamps: true });

type Patient = InferSchemaType<typeof patientSchema>;

export default model<Patient>("Patient", patientSchema);