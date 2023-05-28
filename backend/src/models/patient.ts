import { InferSchemaType, model, ObjectId, Schema } from "mongoose";

const hemoleucogramaSchema = new Schema({
    '(WBC) Leucocite': { type: String },
    'Neutrofile %': { type: String },
    'Monocite %': { type: String },
    'Eosinofile %': { type: String },
    'Basofile %': { type: String },
    'Limfocite %': { type: String },
    'Neutrofile #': { type: String },
    'Monocite #': { type: String },
    'Eosinofile #': { type: String },
    'Basofile #': { type: String },
    'Limfocite #': { type: String },
    '(RBC) Hematii': { type: String },
    'Hemoglobina': { type: String },
    '(HCT) Hematocrit': { type: String },
    '(MCV) Volum mediu eritrocitar': { type: String },
    '(MCH) Hemoglobina eritrocitara medie': { type: String },
    'medie de hemoglob. eritrocitara': { type: String },
    '(RDW-CV) Coef de variatie al indicelui de ditributie al eritrocitelor': { type: String },
    'eritrocitelor': { type: String },
    '(PLT) Trombocite': { type: String },
    '(PDW) Indice de distributie a trombocitelor': { type: String },
    '(MPV) Volum mediu trombocitar': { type: String },
    'Placetocrit': { type: String },
    'date': { type: String },
}, { _id: false }); // use _id: false to disable automatic id for this subdocument

const patientSchema = new Schema({
    name: { type: String, required: true },
    cnp: { type: String, required: true, unique: true },
    doctors: [{type: Schema.Types.ObjectId, ref: 'User'}],
    description: { type: String, required: false },
    Hemoleucograma_completa: [hemoleucogramaSchema],
}, { timestamps: true });

type Patient = InferSchemaType<typeof patientSchema>  & { _id: ObjectId };

export default model<Patient>("Patient", patientSchema);