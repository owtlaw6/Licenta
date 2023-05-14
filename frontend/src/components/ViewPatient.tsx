import React from 'react';
import { MdArrowBack } from "react-icons/md";
import { Patient as PatientModel } from "../models/patient";

interface ViewPatientProps {
    patient: PatientModel,
    goBack: () => void;
}

const ViewPatient: React.FC<ViewPatientProps> = ({ patient, goBack }) => {
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
        />
        <p>{name}</p>
        <p>{cnp}</p>
        <p>{description}</p>
        <div style={{height: '80vh', width: '100vw', overflow: 'auto'}}>
        <iframe
            src="http://192.168.101.18/"
            title="Dash App"
            width="100%"
            height="100%"
            style={{border: 'none'}}
        />
        </div>
    </>
  );
};

export default ViewPatient;