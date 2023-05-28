import styles from "../styles/Note.module.css";
import stylesButton from "../styles/adminButtons.module.css";
import styleUtils from "../styles/utils.module.css";
import { Button, Card } from "react-bootstrap";
import { Patient as PatientModel } from "../models/patient";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { fetchDoctors, Doctor } from "../network/general_api";
import FileUploadDialog from "./FileUploadDialog";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

interface PatientProps {
    patient: PatientModel,
    onPatientClicked: (patient: PatientModel) => void,
    onDeletePatientClicked: (patient: PatientModel) => void,
    onExpand?: (patient: PatientModel) => void,
    onExpandData?: (patient: PatientModel) => void,
    className?: string,
    caller: string,
    displayListGrid: string,
}

const Patient = ({patient, onPatientClicked, onDeletePatientClicked, onExpand, onExpandData, className, caller, displayListGrid }: PatientProps) => {
    const {
        name,
        cnp,
        doctors,
        description,
        createdAt,
        updatedAt
    } = patient;

    const [doctorsAll, setDoctorsAll] = useState<Doctor[]>([]);

    const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filesUploaded, setFilesUploaded] = useState<File[]>([]);

    const handleAddCT = () => {
        setShowFileUploadDialog(true);
    };

    const handleFilesUploaded = (files: File[]) => {
        setFilesUploaded(files);
        setShowFileUploadDialog(false);
    };

    useEffect(() => {
        const getDoctors = async () => {
            const fetchedDoctors = await fetchDoctors();
            setDoctorsAll(fetchedDoctors);
        };
        getDoctors();
    }, []);

    let doctorsNames: string[];
    doctorsNames = [];
    for(let i = 0; i < doctors.length; i++){
        const doctorId = patient.doctors[i];
        const searchedDoctor = doctorsAll.find(({ _id }) => _id === doctorId);
        if (searchedDoctor){
            if (i !== patient.doctors.length - 1)
                doctorsNames.push(searchedDoctor.name + ", ");
            else doctorsNames.push(searchedDoctor.name);
        }
    }

    let createdUpdated: string;
    if (updatedAt > createdAt) {
        createdUpdated = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdated = "Created: " + formatDate(createdAt);
    }

    return (
        <>
            {showFileUploadDialog &&
                <FileUploadDialog caller = "CT"
                    onDismiss={() => setShowFileUploadDialog(false)} 
                    onFilesUploaded={handleFilesUploaded}
                    patientCNP={patient.cnp} 
                />
            }
            { displayListGrid === "grid" && 
                <Card
                    className={`${styles.noteCard} ${className}`}
                    onClick={() => onPatientClicked(patient)}>
                    <Card.Body className={styles.cardBody}>
                        <Card.Title className={styleUtils.flexCenter}>
                            {name}
                            {(caller === 'assistant') && (
                                <MdDelete
                                    className="text-muted ms-auto"
                                    onClick={(e) => {
                                        onDeletePatientClicked(patient);
                                        e.stopPropagation();
                                    }}
                                />
                            )}
                            {(caller === 'doctor') && (
                                <Button className={`${styleUtils.addTopButton}`}
                                    onClick={(e) => {
                                        onExpand ? onExpand(patient) : e.stopPropagation();
                                        e.stopPropagation();
                                    }}
                                >
                                    View CT
                                </Button>
                            )}
                        </Card.Title>
                        <Card.Title className={styleUtils.flexCenter}>
                            {cnp}
                        </Card.Title>
                        <Card.Title className={styleUtils.flexCenter}>
                            {doctorsNames}
                        </Card.Title>
                        <Card.Title className={styles.cardText}>
                            {description}
                        </Card.Title>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        {createdUpdated}
                        {caller === 'technician' && (
                            <Button className={`${styleUtils.addButton}`}
                                onClick={(e) => {
                                    handleAddCT();
                                    e.stopPropagation();
                                }}
                            >
                                Add CT
                            </Button>
                        )}
                        {caller === 'doctor' && (
                            <Button className={`${styleUtils.addButton}`}
                                onClick={(e) => {
                                    onExpandData ? onExpandData(patient) : e.stopPropagation();
                                    e.stopPropagation();
                                }}
                            >
                                View Data
                            </Button>
                        )}
                    </Card.Footer>
                </Card>
            }
            { displayListGrid === "list" && 
                <>
                <tr key={patient._id}>
                    <td onClick={() => onPatientClicked(patient)}>
                        {name}
                    </td>
                    <td onClick={() => onPatientClicked(patient)}>
                        {cnp}
                    </td>
                    <td onClick={() => onPatientClicked(patient)}>
                        {doctorsNames}
                    </td>
                    <td onClick={() => onPatientClicked(patient)}>
                        {createdUpdated}
                    </td>
                    <td>
                        {(caller === 'assistant') && (
                            <MdDelete
                                className="text-muted ms-auto"
                                onClick={(e) => {
                                    onDeletePatientClicked(patient);
                                    e.stopPropagation();
                                }}
                            />
                        )}
                        {caller === 'doctor' && (
                            <>
                            <Button className={stylesButton.buttonsAdmin}
                                onClick={(e) => {
                                    onExpand ? onExpand(patient) : e.stopPropagation();
                                    e.stopPropagation();
                                }}
                            >
                                View CT
                            </Button>
                            <Button
                                onClick={(e) => {
                                    onExpandData ? onExpandData(patient) : e.stopPropagation();
                                    e.stopPropagation();
                                }}
                            >
                                View Data
                            </Button>
                            </>
                        )}
                    </td>
                </tr>
                </>
            }
            <ToastContainer />
        </>
    )
}

export default Patient;