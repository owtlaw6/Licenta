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
        <form className={`${stylePatient.viewPatient} ${stylePatient.patientForm}`}>
            <label className={`${stylePatient.formGroup} ${stylePatient.mylabel}`}>
                Name:
            </label>
            <input className={`${stylePatient.formGroup} ${stylePatient.myinput}`} 
                type="text" value={name} readOnly />
            <label className={`${stylePatient.formGroup} ${stylePatient.mylabel}`}>
                CNP:
            </label>
            <input className={`${stylePatient.formGroup} ${stylePatient.myinput}`} 
                type="text" value={cnp} readOnly />
        </form> <br/>
        <div style={{height: '80vh', width: '100vw', overflow: 'auto'}}>
        <iframe
            src="http://192.168.101.18:8080/data"
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