import { InferSchemaType, model, ObjectId, Schema } from "mongoose";

const patientSchema = new Schema({
    name: { type: String, required: true },
    cnp: { type: String, required: true },
    doctors: [{type: Schema.Types.ObjectId, ref: 'User'}],
    description: { type: String, required: false },
}, { timestamps: true });

type Patient = InferSchemaType<typeof patientSchema>  & { _id: ObjectId };

export default model<Patient>("Patient", patientSchema);