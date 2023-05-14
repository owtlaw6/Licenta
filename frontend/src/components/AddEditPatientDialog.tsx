import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Patient } from "../models/patient";
import TextInputField from "./form/TextInputField";
import * as PatientsApi from "../network/patients_api"
import DoctorSelect from "./DoctorSelect";
import { useState } from "react";
import FileUploadDialog from "./FileUploadDialog";

interface PatientInput {
    name: string,
    cnp: string,
    doctors: string[],
    description: string,
}

interface AddEditPatientDialogProps {
    patientToEdit?: Patient,
    onDismiss: () => void,
    onPatientSaved: (patient: Patient) => void,
    caller: string,
}

const AddEditPatientDialog = ({patientToEdit, onDismiss, onPatientSaved, caller}: AddEditPatientDialogProps) => {

    const [selectedDoctors, setSelectedDoctors] = useState<string[]>(patientToEdit?.doctors || []);

    const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

    const handleDoctorChange = (selectedOptions: string[]) => {
        setSelectedDoctors(selectedOptions);
    };

    const handleAddCT = () => {
        setShowFileUploadDialog(true);
    };

    const handleFilesUploaded = (files: File[]) => {
        setShowFileUploadDialog(false);
        // TODO: Handle the uploaded files here.
    };

    const { register, handleSubmit, formState : {errors, isSubmitting} } = useForm<PatientInput>({
        defaultValues:{
            name: patientToEdit?.name || "",
            cnp: patientToEdit?.cnp || "",
            description: patientToEdit?.description || "",
        }
    });

    async function onSubmit(input: PatientInput){
        input = {...input, doctors: selectedDoctors};
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
                    <TextInputField readOnly={caller !== 'assistant'}
                        name="name"
                        label="Name"
                        type="text"
                        placeholder="Name"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.name}
                    />
                    <TextInputField readOnly={caller !== 'assistant'}
                        name="cnp"
                        label="Cnp"
                        type="text"
                        placeholder="Cnp"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.cnp}
                    />

                    <form>
                        <label htmlFor="doctors">Doctors</label>
                        <DoctorSelect onChange={handleDoctorChange} 
                        selectedDoctors={selectedDoctors}
                        />
                    </form>

                    <br/>
                    <TextInputField
                        name="description"
                        label="Description"
                        as="textarea"
                        rows={5}
                        placeholder="Description"
                        register={register}
                        error={errors.description}
                    />
                    
                </Form>
            </Modal.Body>

            <Modal.Footer>
                {caller === 'technician' 
                    ? <>
                            {showFileUploadDialog && 
                                <FileUploadDialog onDismiss={() => setShowFileUploadDialog(false)} 
                                    onFilesUploaded={handleFilesUploaded} />
                            }
                            <Button
                                onClick={handleAddCT}
                                disabled={isSubmitting}
                            >
                                Add CT
                            </Button>
                        </>
                    : <></>
                }
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