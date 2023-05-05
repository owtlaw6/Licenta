import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
//import { Note as NoteModel } from '../models/note';
import { Patient as PatientModel } from '../models/patient';
import * as PatientsApi from "../network/patients_api";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditPatientDialog from "./AddEditPatientDialog";
import Patient from './Patient';

const AssistantPageLoggedIn = () => {

    const [patients, setPatients] = useState<PatientModel[]>([]);
    const [patientsLoading, setPatientsLoading] = useState(true);
    const [showPatientsLoadingError, setShowPatientsLoadingError] = useState(false);

    const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<PatientModel | null>(null);

    useEffect(() => {
        async function loadPatient() {
            try {
                setShowPatientsLoadingError(false);
                setPatientsLoading(true);
                const patients = await PatientsApi.fetchPatients();
                setPatients(patients);
            } catch (error) {
                console.error(error);
                setShowPatientsLoadingError(true);
            } finally {
                setPatientsLoading(false);
            }
        }
        loadPatient();
    }, []);

    async function deletePatient(patient: PatientModel) {
        try {
            await PatientsApi.deletePatient(patient._id);
            setPatients(patients.filter(existingPatient => existingPatient._id !== patient._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const patientsGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {patients.map(patient => (
                <Col key={patient._id}>
                    <Patient
                        patient={patient}
                        className={styles.note}
                        onPatientClicked={setPatientToEdit}
                        onDeletePatientClicked={deletePatient}
                    />
                </Col>
            ))}
        </Row>

    return (
        <>
            <Button
                className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                onClick={() => setShowAddPatientDialog(true)}>
                <FaPlus />
                Add new patient
            </Button>
            {patientsLoading && <Spinner animation='border' variant='primary' />}
            {showPatientsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
            {!patientsLoading && !showPatientsLoadingError &&
                <>
                    {patients.length > 0
                        ? patientsGrid
                        : <p>You don't have any patients yet</p>
                    }
                </>
            }
            {showAddPatientDialog &&
                <AddEditPatientDialog
                    onDismiss={() => setShowAddPatientDialog(false)}
                    onPatientSaved={(newPatient) => {
                        setPatients([...patients, newPatient]);
                        setShowAddPatientDialog(false);
                    }}
                />
            }
            {patientToEdit &&
                <AddEditPatientDialog
                    patientToEdit={patientToEdit}
                    onDismiss={() => setPatientToEdit(null)}
                    onPatientSaved={(updatedPatient) => {
                        setPatients(patients.map(existingPatient => existingPatient._id === 
                                            updatedPatient._id ? updatedPatient : existingPatient));
                        setPatientToEdit(null);
                    }}
                />
            }
        </>
    );
}

export default AssistantPageLoggedIn;