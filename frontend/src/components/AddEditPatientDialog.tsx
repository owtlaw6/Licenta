import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Patient } from "../models/patient";
import TextInputField from "./form/TextInputField";
import * as PatientsApi from "../network/patients_api"
import DoctorSelect from "./DoctorSelect";
import { useState } from "react";
import { Doctor } from "../network/general_api"; 

interface PatientInput {
    name: string,
    cnp: string,
    doctor: string,
}

interface AddEditPatientDialogProps {
    patientToEdit?: Patient,
    onDismiss: () => void,
    onPatientSaved: (patient: Patient) => void,
}

const AddEditPatientDialog = ({patientToEdit, onDismiss, onPatientSaved}: AddEditPatientDialogProps) => {

    const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([]);

    const handleDoctorChange = (selectedOptions: Doctor[]) => {
        setSelectedDoctors(selectedOptions);
    };

    const { register, handleSubmit, formState : {errors, isSubmitting} } = useForm<PatientInput>({
        defaultValues:{
            name: patientToEdit?.name || "",
            cnp: patientToEdit?.cnp || "",
            doctor: patientToEdit?.doctor || "",
        }
    });

    async function onSubmit(input: PatientInput){
        try {
            let patientResponse: Patient;
            if(patientToEdit){
                patientResponse = await PatientsApi.updatePatient(patientToEdit._id, input);
            } else {
                patientResponse = await PatientsApi.createPatient(input);
            }
            onPatientSaved(patientResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {patientToEdit ? "Edit patient" : "Add patient"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditPatientForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="name"
                        label="Name"
                        type="text"
                        placeholder="Name"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.name}
                    />
                    <TextInputField
                        name="cnp"
                        label="Cnp"
                        type="text"
                        placeholder="Cnp"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.cnp}
                        
                    />

                    <form>
                        <label htmlFor="doctors">Doctors:</label>
                        <DoctorSelect onChange={handleDoctorChange} />
                    </form>

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditPatientForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default AddEditPatientDialog;