import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import styles from "../styles/NotesPage.module.css";
import Patient from './Patient';
import { Patient as PatientModel } from '../models/patient';
import AddEditPatientDialog from './AddEditPatientDialog';
import * as PatientsApi from "../network/patients_api";

const DoctorPageLoggedInView = () => {

    const [patients, setPatients] = useState<PatientModel[]>([]);
    const [patientsLoading, setPatientsLoading] = useState(true);
    const [showPatientsLoadingError, setShowPatientsLoadingError] = useState(false);

    const [showPatientDialog, setShowPatientDialog] = useState(false);
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
            {showPatientDialog &&
                <AddEditPatientDialog
                    onDismiss={() => setShowPatientDialog(false)}
                    onPatientSaved={(newPatient) => {
                        setPatients([...patients, newPatient]);
                        setShowPatientDialog(false);
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

export default DoctorPageLoggedInView;