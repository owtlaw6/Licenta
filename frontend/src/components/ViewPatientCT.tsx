import React from 'react';
import { MdArrowBack } from "react-icons/md";
import { Patient as PatientModel } from "../models/patient";
import stylePatient from "../styles/ViewPatient.module.css";

interface ViewPatientProps {
    patient: PatientModel,
    goBack: () => void;
}

const ViewPatientCT: React.FC<ViewPatientProps> = ({ patient, goBack }) => {
    const {
        name,
        cnp,
        doctors,
        description,
    } = patient;

    return (
    <>
        <MdArrowBack
            style={{height: '5vh', width: '5vw', overflow: 'auto'}}
            onClick={goBack}
        /> <br/>
        <label className={`${stylePatient.patientDetails}`}>
            Name: {name}
        </label>
        <label className={`${stylePatient.patientDetails}`}>
            CNP: {cnp}
        </label> <br/>
        <div style={{height: '80vh', width: '100vw', overflow: 'auto'}}>
        <iframe
            src={"http://192.168.101.31:3000/visualize?cnp=" + {cnp}}
            title="Dash App"
            width="100%"
            height="100%"
            style={{border: 'none'}}
        />
        </div>
    </>
  );
};

export default ViewPatientCT;