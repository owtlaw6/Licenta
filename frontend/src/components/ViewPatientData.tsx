import React, { useEffect, useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { Patient as PatientModel } from "../models/patient";
import { Button } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import styleUtils from "../styles/utils.module.css";
import stylePatient from "../styles/ViewPatient.module.css";
import FileUploadDialog from './FileUploadDialog';
import axios from "axios";
import Table from 'react-bootstrap/Table'; 

interface PatientData {
    '(WBC) Leucocite': string;
    'Neutrofile %': string;
    'Monocite %': string;
    'Eosinofile %': string;
    'Basofile %': string;
    'Limfocite %': string;
    'Neutrofile #': string;
    'Monocite #': string;
    'Eosinofile #': string;
    'Basofile #': string;
    'Limfocite #': string;
    '(RBC) Hematii': string;
    'Hemoglobina': string;
    '(HCT) Hematocrit': string;
    '(MCV) Volum mediu eritrocitar': string;
    '(MCH) Hemoglobina eritrocitara medie': string;
    'medie de hemoglob. eritrocitara': string;
    '(RDW-CV) Coef de variatie al indicelui de ditributie al eritrocitelor': string;
    'eritrocitelor': string;
    '(PLT) Trombocite': string;
    '(PDW) Indice de distributie a trombocitelor': string;
    '(MPV) Volum mediu trombocitar': string;
    'Placetocrit': string;
    'date': string;
}

interface PatientNoduleData{
    cnp: string,
    Hemoleucograma_completa: PatientData[];
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
        let sortableData = [...patientData?.Hemoleucograma_completa ?? []];
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
        <Table striped bordered hover size="sm" 
                className={`${stylePatient.patientDataTable}`}>
            <thead className="thead-dark">
                <tr>
                    <th scope="col" onClick={() => requestSort('date')}>
                        Data
                    </th>
                    <th scope="col" onClick={() => requestSort('(WBC) Leucocite')}>
                        (WBC) Leucocite
                    </th>
                    <th scope="col" onClick={() => requestSort('Neutrofile %')}>
                        Neutrofile %
                    </th>
                    <th scope="col" onClick={() => requestSort('Monocite %')}>
                        Monocite %
                    </th>
                    <th scope="col" onClick={() => requestSort('Eosinofile %')}>
                        Eosinofile %
                    </th>
                    <th scope="col" onClick={() => requestSort('Basofile %')}>
                        Basofile %
                    </th>
                    <th scope="col" onClick={() => requestSort('Limfocite %')}>
                        Limfocite %
                    </th>
                    <th scope="col" onClick={() => requestSort('Neutrofile #')}>
                        Neutrofile #
                    </th>
                    <th scope="col" onClick={() => requestSort('Monocite #')}>
                        Monocite #
                    </th>
                    <th scope="col" onClick={() => requestSort('Eosinofile #')}>
                        Eosinofi
                    </th>
                    <th scope="col" onClick={() => requestSort('Basofile #')}>
                        Basofi
                    </th>
                    <th scope="col" onClick={() => requestSort('Limfocite #')}>
                        Limfocite #
                    </th>
                    <th scope="col" onClick={() => requestSort('(RBC) Hematii')}>
                        (RBC) Hematii
                    </th>
                    <th scope="col" onClick={() => requestSort('Hemoglobina')}>
                        (HGB) Hemoglobina
                    </th>
                    <th scope="col" onClick={() => requestSort('(HCT) Hematocrit')}>
                        (HCT) Hematocrit
                    </th>
                    <th scope="col" onClick={() => requestSort('(MCV) Volum mediu eritrocitar')}>
                        (MCV) Volum mediu eritrocitar
                    </th>
                    <th scope="col" onClick={() => requestSort('(MCH) Hemoglobina eritrocitara medie')}>
                        (MCH) Hemoglobina eritrocitara medie
                    </th>
                    <th scope="col" onClick={() => requestSort('medie de hemoglob. eritrocitara')}>
                        (MCHC) Concentr. medie de hemoglob. eritrocitara
                    </th>
                    <th scope="col" onClick={() => requestSort('(RDW-CV) Coef de variatie al indicelui de ditributie al eritrocitelor')}>
                        (RDW-CV) Coef de variatie al indicelui de ditributie al eritrocitelor
                    </th>
                    <th scope="col" onClick={() => requestSort('eritrocitelor')}>
                        (RDW-SD) Indice de ditributie a eritrocitelor
                    </th>
                    <th scope="col" onClick={() => requestSort('(PLT) Trombocite')}>
                        (PLT) Trombocite
                    </th>
                    <th scope="col" onClick={() => requestSort('(PDW) Indice de distributie a trombocitelor')}>
                        (PDW) Indice de distributie a trombocitelor
                    </th>
                    <th scope="col" onClick={() => requestSort('(MPV) Volum mediu trombocitar')}>
                        (MPV) Volum mediu trombocitar
                    </th>
                    <th scope="col" onClick={() => requestSort('Placetocrit')}>
                        *(PCT) Placetocrit
                    </th>
                </tr>
            </thead>
            <tbody>
                {patientData && patientData.Hemoleucograma_completa && 
                sortedData.map((Hemoleucograma_completa, index) => (
                    <tr key={index}>
                        <td>{Hemoleucograma_completa['date']}</td>
                        <td>{Hemoleucograma_completa['(WBC) Leucocite']}</td>
                        <td>{Hemoleucograma_completa['Neutrofile %']}</td>
                        <td>{Hemoleucograma_completa['Monocite %']}</td>
                        <td>{Hemoleucograma_completa['Eosinofile %']}</td>
                        <td>{Hemoleucograma_completa['Basofile %']}</td>
                        <td>{Hemoleucograma_completa['Limfocite %']}</td>
                        <td>{Hemoleucograma_completa['Neutrofile #']}</td>
                        <td>{Hemoleucograma_completa['Monocite #']}</td>
                        <td>{Hemoleucograma_completa['Eosinofile #']}</td>
                        <td>{Hemoleucograma_completa['Basofile #']}</td>
                        <td>{Hemoleucograma_completa['Limfocite #']}</td>
                        <td>{Hemoleucograma_completa['(RBC) Hematii']}</td>
                        <td>{Hemoleucograma_completa['Hemoglobina']}</td>
                        <td>{Hemoleucograma_completa['(HCT) Hematocrit']}</td>
                        <td>{Hemoleucograma_completa['(MCV) Volum mediu eritrocitar']}</td>
                        <td>{Hemoleucograma_completa['(MCH) Hemoglobina eritrocitara medie']}</td>
                        <td>{Hemoleucograma_completa['medie de hemoglob. eritrocitara']}</td>
                        <td>{Hemoleucograma_completa['(RDW-CV) Coef de variatie al indicelui de ditributie al eritrocitelor']}</td>
                        <td>{Hemoleucograma_completa['eritrocitelor']}</td>
                        <td>{Hemoleucograma_completa['(PLT) Trombocite']}</td>
                        <td>{Hemoleucograma_completa['(PDW) Indice de distributie a trombocitelor']}</td>
                        <td>{Hemoleucograma_completa['(MPV) Volum mediu trombocitar']}</td>
                        <td>{Hemoleucograma_completa['Placetocrit']}</td>
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