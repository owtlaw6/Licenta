import { useEffect, useState } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import styles from "../styles/NotesPage.module.css";
import styleButtons from "../styles/utils.module.css";
import Patient from './Patient';
import { Patient as PatientModel } from '../models/patient';
import AddEditPatientDialog from './AddEditPatientDialog';
import * as PatientsApi from "../network/patients_api";
import { MdSearch } from "react-icons/md";
import { FaList, FaSort } from 'react-icons/fa';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import ViewPatientCT from './ViewPatientCT';
import ViewPatientData from './ViewPatientData';
import Table from 'react-bootstrap/Table';
import React from 'react';

const DoctorPageLoggedInView = () => {

    const [patients, setPatients] = useState<PatientModel[]>([]);
    const [patientsLoading, setPatientsLoading] = useState(true);
    const [showPatientsLoadingError, setShowPatientsLoadingError] = useState(false);

    const [showPatientDialog, setShowPatientDialog] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<PatientModel | null>(null);

    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState("listView");
    const [viewMode, setViewMode] = useState("grid");
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
            await PatientsApi.getPatient(patient._id);
            setPage("expandedViewCT");
            setPatientToView(patient);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function expandPatientData(patient: PatientModel) { 
        try {
            await PatientsApi.getPatient(patient._id);
            setPage("expandedViewData");
            setPatientToView(patient);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    };

    const [sortConfig, setSortConfig] = useState<{key: keyof PatientModel, direction: 'ascending' | 'descending'} | null>(null);

    const sortedData = React.useMemo(() => {
        let sortableData = [...patients ?? []];
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
    }, [patients, sortConfig]);

    function requestSort(key: keyof PatientModel) {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    const patientsGrid =
        <>
            <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
                {patients.filter((patient) =>
                    `${patient.name} ${patient.cnp}`
                        .toLowerCase()
                        .includes(searchText.toLowerCase()))
                    .reverse()
                    .map(patient => (
                        <Col key={patient._id}>
                            <Patient key={patient._id} caller="doctor" displayListGrid="grid"
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

const patientsList =
        <>
            <Table striped bordered hover size="sm" className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" onClick={() => requestSort('name')}>
                            <FaSort className={`text-muted ms-auto`} />
                            Name
                        </th>
                        <th scope="col" onClick={() => requestSort('cnp')}>
                            <FaSort className={`text-muted ms-auto`} />
                            CNP
                        </th>
                        <th scope="col" onClick={() => requestSort('doctors')}>
                            <FaSort className={`text-muted ms-auto`} />
                            Doctors
                        </th>
                        <th scope="col">Date</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                {sortedData.filter((patient) =>
                    `${patient.name} ${patient.cnp}`
                        .toLowerCase()
                        .includes(searchText.toLowerCase()))
                    .map(patient => (
                        <Patient key={patient._id} caller="doctor" displayListGrid="list"
                            patient={patient}
                            className={styles.note}
                            onPatientClicked={setPatientToEdit}
                            onDeletePatientClicked={deletePatient}
                            onExpand={expandPatientCT}
                            onExpandData={expandPatientData}
                        />
                    ))}
                </tbody>
            </Table>
        </>

    return (
        <>  
        {page === "listView" ? <>
            <BsFillGrid3X3GapFill className={`${styleButtons.viewModeButtonsContainerGrid}`} 
                onClick={toggleViewMode} />
            <FaList className={`${styleButtons.viewModeButtonsContainerList}`} 
                onClick={toggleViewMode} />
            <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search patients"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <MdSearch className={styles.searchIcon} />
            </div> <br/>

            {patientsLoading && <Spinner animation='border' variant='primary' />}
            {showPatientsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
            {!patientsLoading && !showPatientsLoadingError &&
                <>
                    {patients.length > 0
                        ? viewMode === "grid" 
                            ? patientsGrid
                            : patientsList
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