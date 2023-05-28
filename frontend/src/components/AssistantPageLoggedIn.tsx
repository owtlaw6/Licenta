import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Patient as PatientModel } from '../models/patient';
import * as PatientsApi from "../network/patients_api";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import styleButtons from "../styles/utils.module.css";
import AddEditPatientDialog from "./AddEditPatientDialog";
import Patient from './Patient';
import { MdSearch } from "react-icons/md";
import { FaList } from 'react-icons/fa';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import Table from 'react-bootstrap/Table';
import React from 'react';

const AssistantPageLoggedIn = () => {
    const [patients, setPatients] = useState<PatientModel[]>([]);
    const [patientsLoading, setPatientsLoading] = useState(true);
    const [showPatientsLoadingError, setShowPatientsLoadingError] = useState(false);

    const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<PatientModel | null>(null);

    const [searchText, setSearchText] = useState("");

    const [viewMode, setViewMode] = useState("grid");

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    };

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

    async function deletePatient(patient: PatientModel) { }

    const patientsGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {patients.filter((patient) =>
                `${patient.name} ${patient.cnp}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase()))
                .map(patient => (
                <Col key={patient._id}>
                    <Patient key={patient._id} caller="assistant" displayListGrid="grid"
                        patient={patient}
                        className={styles.note}
                        onPatientClicked={setPatientToEdit}
                        onDeletePatientClicked={deletePatient}
                    />
                </Col>
            ))}
        </Row>
    
    const patientsList =
        <>
            <Table striped bordered hover size="sm" className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" onClick={() => requestSort('name')}>
                            Name
                        </th>
                        <th scope="col" onClick={() => requestSort('cnp')}>
                            CNP
                        </th>
                        <th scope="col" onClick={() => requestSort('doctors')}>
                            Doctors
                        </th>
                        <th scope="col" >
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                {sortedData.filter((patient) =>
                    `${patient.name} ${patient.cnp}`
                        .toLowerCase()
                        .includes(searchText.toLowerCase()))
                    .map(patient => (
                        <Patient key={patient._id} caller="assistant" displayListGrid="list"
                            patient={patient}
                            className={styles.note}
                            onPatientClicked={setPatientToEdit}
                            onDeletePatientClicked={deletePatient}
                        />
                    ))}
                </tbody>
            </Table>
        </>

    return (
        <>
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
            </div>

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
                        ? viewMode === "grid" 
                            ? patientsGrid
                            : patientsList
                        : <p>You don't have any patients yet</p>
                    }
                </>
            }
            {showAddPatientDialog &&
                <AddEditPatientDialog caller="assistant"
                    onDismiss={() => setShowAddPatientDialog(false)}
                    onPatientSaved={(newPatient) => {
                        setPatients([...patients, newPatient]);
                        setShowAddPatientDialog(false);
                    }}
                />
            }
            {patientToEdit &&
                <AddEditPatientDialog caller="assistant"
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