import { InferSchemaType, model, ObjectId, Schema } from "mongoose";

const hemoleucogramaSchema = new Schema<Record<string, any>>({}, { _id: false, strict: false });

const patientSchema = new Schema({
    name: { type: String, required: true },
    cnp: { type: String, required: true, unique: true },
    doctors: [{type: Schema.Types.ObjectId, ref: 'User'}],
    description: { type: String, required: false },
    Hemoleucograma_completa: [hemoleucogramaSchema],
}, { timestamps: true });

type Patient = InferSchemaType<typeof patientSchema>  & { _id: ObjectId };

export default model<Patient>("Patient", patientSchema);