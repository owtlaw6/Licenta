import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fetchDoctors, Doctor } from "../network/general_api";

interface DoctorSelectProps {
    onChange: (selectedDoctors: Doctor[]) => void;
}

const DoctorSelect: React.FC<DoctorSelectProps> = ({ onChange }) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([]);
  
    useEffect(() => {
      const getDoctors = async () => {
        const fetchedDoctors = await fetchDoctors();
        setDoctors(fetchedDoctors);
        console.log("random " + fetchedDoctors.length);
      };
      
      getDoctors();
    }, []);
  
    const handleChange = (selectedOptions: any) => {
      const selectedDocs = selectedOptions.map((option: any) => ({
        _id: option.value,
        name: option.label,
      }));
  
      setSelectedDoctors(selectedDocs);
      onChange(selectedDocs);
    };
  
    const doctorOptions = doctors.map((doctor) => ({
      value: doctor._id,
      label: doctor.name,
    }));
  
    return (
        <div className="dropdown-container">
            <Select
            isMulti
            options={doctorOptions}
            onChange={handleChange}
            placeholder="Select doctors"
            />
        </div>
    );
  };
  
  export default DoctorSelect;