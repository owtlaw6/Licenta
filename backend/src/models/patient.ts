import { InferSchemaType, model, ObjectId, Schema } from "mongoose";

const noduleDataSchema = new Schema({
    nodule_volume: { type: Number },
    nodule_area: { type: Number },
    fractal_dimension: { type: Number },
    calcification: { type: Number },
    spiculation: { type: Number },
    type_of_nodule: { type: String },
}, { _id: false }); // use _id: false to disable automatic id for this subdocument

const patientSchema = new Schema({
    name: { type: String, required: true },
    cnp: { type: String, required: true, unique: true },
    doctors: [{type: Schema.Types.ObjectId, ref: 'User'}],
    description: { type: String, required: false },
    Data: [noduleDataSchema],
}, { timestamps: true });

type Patient = InferSchemaType<typeof patientSchema>  & { _id: ObjectId };

export default model<Patient>("Patient", patientSchema);