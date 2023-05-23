import React, { useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { Patient as PatientModel } from "../models/patient";
import { Button } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import styleUtils from "../styles/utils.module.css";
import FileUploadDialog from './FileUploadDialog';

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
        />
        <Button
            className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
            onClick={(e) => {
                handleAddDataPdf();
                e.stopPropagation();
            }}>
            <FaPlus />
            Add new data pdf
        </Button>
        <p>{name}</p>
        <p>{cnp}</p>
        <p>{cnp}</p>
        <div style={{height: '80vh', width: '100vw', overflow: 'auto'}}>
        <iframe
            src="http://192.168.101.18:8080/data"
            title="Dash App"
            width="100%"
            height="100%"
            style={{border: 'none'}}
        />
        </div>
    </>
  );
};

export default ViewPatientData;