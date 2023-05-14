import React from 'react';
import { MdArrowBack } from "react-icons/md";

interface ViewPatientProps {
    goBack: () => void;
}

const ViewPatient: React.FC<ViewPatientProps> = ({ goBack }) => {
    return (
    <>
        <MdArrowBack
            style={{height: '5vh', width: '5vw', overflow: 'auto'}}
            onClick={goBack}
        />
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