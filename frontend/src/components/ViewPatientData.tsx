import React, { useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { Patient as PatientModel } from "../models/patient";
import { Button } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import styleUtils from "../styles/utils.module.css";
import stylePatient from "../styles/ViewPatient.module.css";
import FileUploadDialog from './FileUploadDialog';
import ExampleComponent from './ExampleComponent';

interface ViewPatientProps {
    patient: PatientModel,
    goBack: () => void;
}

const ViewPatientData: React.FC<ViewPatientProps> = ({ patient, goBack }) => {
    const {
        name,
        cnp,
        doctors,
        description,
    } = patient;

    const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filesUploaded, setFilesUploaded] = useState<File[]>([]);

    const handleAddDataPdf = () => {
        setShowFileUploadDialog(true);
    };

    const handleFilesUploaded = (files: File[]) => {
        setFilesUploaded(files);
        setShowFileUploadDialog(false);
        goBack();
    };

    return (
    <>
        {showFileUploadDialog &&
            <FileUploadDialog 
                onDismiss={() => setShowFileUploadDialog(false)} 
                onFilesUploaded={handleFilesUploaded}
                patientCNP={cnp} 
            />
        }
        <MdArrowBack
            style={{height: '5vh', width: '5vw', overflow: 'auto'}}
            onClick={goBack}
        /> <br/>
        <Button
            className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
            onClick={(e) => {
                handleAddDataPdf();
                e.stopPropagation();
            }}>
            <FaPlus />
            Add new data pdf
        </Button>
        <form className={`${stylePatient.viewPatient} ${stylePatient.patientForm}`}>
            <label className={`${stylePatient.formGroup} ${stylePatient.label}`}>
                Name:
            </label>
            <input className={`${stylePatient.formGroup} ${stylePatient.myinput}`} 
                type="text" value={name} readOnly />
            <label className={`${stylePatient.formGroup} ${stylePatient.label}`}>
                CNP:
            </label>
            <input className={`${stylePatient.formGroup} ${stylePatient.myinput}`} 
                type="text" value={cnp} readOnly />
        </form> <br/>
        <div style={{height: '80vh', width: '100vw', overflow: 'auto'}}>
        <ExampleComponent
        />
        </div>
    </>
  );
};

export default ViewPatientData;