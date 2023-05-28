import React, { useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { Patient as PatientModel } from "../models/patient";
import { Button } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import styleUtils from "../styles/utils.module.css";
import stylePatient from "../styles/ViewPatient.module.css";
import FileUploadDialog from './FileUploadDialog';
import ExampleComponent from './ExampleComponent';
import axios from "axios";
import Table from 'react-bootstrap/Table';

interface PatientData {
    nodule_volume: number;
    nodule_area: number;
    fractal_dimension: number;
    calcification: number;
    spiculation: number;
    type_of_nodule: string;
}

interface PatientNoduleData{
    cnp: string,
    data: PatientData[];
}

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

    const fetchNoduleDetails = async (): Promise<PatientNoduleData> => {
        const response = await axios.get('/api/patients/' + cnp);
        return response.data;
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
        <label className={`${stylePatient.patientDetails}`}>
            Name: {name}
        </label>
        <label className={`${stylePatient.patientDetails}`}>
            CNP: {cnp}
        </label>
        <Button
            className={`mb-4 ${styleUtils.blockTopCenter} ${styleUtils.flexCenter}`}
            onClick={(e) => {
                handleAddDataPdf();
                e.stopPropagation();
            }}>
            <FaPlus />
            Add new data pdf
        </Button>
        
        <br/><br/>
        <Table striped bordered hover size="sm" className="table">
            <thead className="thead-dark">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">CNP</th>
                    <th scope="col">nodule_volume</th>
                    <th scope="col">nodule_area</th>
                    <th scope="col">fractal_dimension</th>
                    <th scope="col">calcification</th>
                    <th scope="col">spiculation</th>
                    <th scope="col">type_of_nodule</th>
                </tr>
            </thead>
            <tbody>
                <tr key={patient._id}>
                    <td>{name}</td>
                    <td>{cnp}</td>
                    {/* <td> {fetchNoduleDetails().Data.nodule_volume}</td> */}
                </tr>
            </tbody>
        </Table>
        
        <br/>
        <ExampleComponent
        />
    </>
  );
};

export default ViewPatientData;