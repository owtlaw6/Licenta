import { useEffect, useState } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import { Patient as PatientModel } from '../models/patient';
import * as PatientsApi from "../network/patients_api";
import styles from "../styles/NotesPage.module.css";
import AddEditPatientDialog from "./AddEditPatientDialog";
import Patient from './Patient';
import { MdSearch } from "react-icons/md";

const TechnicianPageLoggedInView = () => {

    const [patients, setPatients] = useState<PatientModel[]>([]);
    const [patientsLoading, setPatientsLoading] = useState(true);
    const [showPatientsLoadingError, setShowPatientsLoadingError] = useState(false);

    const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<PatientModel | null>(null);

    const [searchText, setSearchText] = useState("");

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

    async function deletePatient(patient: PatientModel) { }

    const patientsGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {patients.filter((patient) =>
                searchText.length === 13 && patient.cnp.toLowerCase() === searchText.toLowerCase())
                .map(patient => (
                    <Col key={patient._id}>
                        <Patient key={patient._id} caller="technician" displayListGrid="grid"
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
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search patients CNP"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <MdSearch className={styles.searchIcon} />
            </div>

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
                <AddEditPatientDialog caller="technician"
                    onDismiss={() => setShowAddPatientDialog(false)}
                    onPatientSaved={(newPatient) => {
                        setPatients([...patients, newPatient]);
                        setShowAddPatientDialog(false);
                    }}
                />
            }
            {patientToEdit &&
                <AddEditPatientDialog caller="technician"
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

export default TechnicianPageLoggedInView;