import React, { useEffect, useState } from 'react';
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
    Data: PatientData[];
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

    const [patientData, setPatientData] = useState<PatientNoduleData | null>(null);

    useEffect(() => {
        const fetchNoduleDetails = async () => {
            try {
                const response = await axios.get(`/api/patients/${patient._id}`);
                setPatientData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNoduleDetails();
    }, [patient._id]);

    const [sortConfig, setSortConfig] = useState<{key: keyof PatientData, direction: 'ascending' | 'descending'} | null>(null);

    const sortedData = React.useMemo(() => {
        let sortableData = [...patientData?.Data ?? []];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [patientData, sortConfig]);

    function requestSort(key: keyof PatientData) {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    return (
    <>
        {showFileUploadDialog &&
            <FileUploadDialog caller = "PDF"
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
                    <th scope="col" onClick={() => requestSort('nodule_volume')}>
                        nodule_volume
                    </th>
                    <th scope="col" onClick={() => requestSort('nodule_area')}>
                        nodule_area
                    </th>
                    <th scope="col" onClick={() => requestSort('fractal_dimension')}>
                        fractal_dimension
                    </th>
                    <th scope="col" onClick={() => requestSort('calcification')}>
                        calcification
                    </th>
                    <th scope="col" onClick={() => requestSort('spiculation')}>
                        spiculation
                    </th>
                    <th scope="col" onClick={() => requestSort('type_of_nodule')}>
                        type_of_nodule
                    </th>
                </tr>
            </thead>
            <tbody>
                {patientData && patientData.Data && sortedData.map((Data, index) => (
                    <tr key={index}>
                        <td>{Data.nodule_volume}</td>
                        <td>{Data.nodule_area}</td>
                        <td>{Data.fractal_dimension}</td>
                        <td>{Data.calcification}</td>
                        <td>{Data.spiculation}</td>
                        <td>{Data.type_of_nodule}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        
        <br/>
        {/*<ExampleComponent
        />*/}
    </>
  );
};

export default ViewPatientData;