import { useEffect, useState } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import styles from "../styles/NotesPage.module.css";
import Patient from './Patient';
import { Patient as PatientModel } from '../models/patient';
import AddEditPatientDialog from './AddEditPatientDialog';
import * as PatientsApi from "../network/patients_api";
import { MdSearch } from "react-icons/md";
import ViewPatientCT from './ViewPatientCT';
import ViewPatientData from './ViewPatientData';

const DoctorPageLoggedInView = () => {

    const [patients, setPatients] = useState<PatientModel[]>([]);
    const [patientsLoading, setPatientsLoading] = useState(true);
    const [showPatientsLoadingError, setShowPatientsLoadingError] = useState(false);

    const [showPatientDialog, setShowPatientDialog] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<PatientModel | null>(null);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState("listView");
    const [patientToView, setPatientToView] = useState<PatientModel>();

    const goBackToListView = () => setPage("listView");

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

    async function expandPatientCT(patient: PatientModel) { 
        try {
            await PatientsApi.viewPatient(patient._id);
            setPage("expandedViewCT");
            setPatientToView(patient);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function expandPatientData(patient: PatientModel) { 
        try {
            await PatientsApi.viewPatient(patient._id);
            setPage("expandedViewData");
            setPatientToView(patient);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const patientsGrid =
        <>
            <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search patients"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <MdSearch className={styles.searchIcon} />
            </div>
            <br/>
            
            <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
                {patients.filter((patient) =>
                    `${patient.name} ${patient.cnp}`
                        .toLowerCase()
                        .includes(searchText.toLowerCase()))
                    .map(patient => (
                        <Col key={patient._id}>
                            <Patient key={patient._id} caller="doctor"
                                patient={patient}
                                className={styles.note}
                                onPatientClicked={setPatientToEdit}
                                onDeletePatientClicked={deletePatient}
                                onExpand={expandPatientCT}
                                onExpandData={expandPatientData}
                            />
                        </Col>
                    ))}
            </Row>
        </>

    return (
        <>  
        {page === "listView" ? <>
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
                <AddEditPatientDialog caller="doctor"
                    onDismiss={() => setShowPatientDialog(false)}
                    onPatientSaved={(newPatient) => {
                        setPatients([...patients, newPatient]);
                        setShowPatientDialog(false);
                    }}
                />
            }
            {patientToEdit &&
                <AddEditPatientDialog caller="doctor"
                    patientToEdit={patientToEdit}
                    onDismiss={() => setPatientToEdit(null)}
                    onPatientSaved={(updatedPatient) => {
                        setPatients(patients.map(existingPatient => existingPatient._id ===
                            updatedPatient._id ? updatedPatient : existingPatient));
                        setPatientToEdit(null);
                    }}
                />
            }
        </>: patientToView && page === "expandedViewCT" ? (
            <ViewPatientCT key={patientToView._id} 
                patient={patientToView}
                goBack={goBackToListView} 
            />
        ) : patientToView && page === "expandedViewData" ? (
            <ViewPatientData key={patientToView._id} 
                patient={patientToView}
                goBack={goBackToListView} 
            />
        ) : null }
        </>
    );
}

export default DoctorPageLoggedInView;