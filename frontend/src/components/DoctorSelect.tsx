import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fetchDoctors, Doctor } from "../network/general_api";

interface DoctorSelectProps {
    selectedDoctors: string[];
    onChange: (selectedDoctors: string[]) => void;
}

const DoctorSelect: React.FC<DoctorSelectProps> = ({ selectedDoctors, onChange }) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    useEffect(() => {
        const getDoctors = async () => {
            const fetchedDoctors = await fetchDoctors();
            setDoctors(fetchedDoctors);
        };

        getDoctors();
    }, []);

    const handleChange = (selectedOptions: any) => {
        const selectedDocs = selectedOptions.map((option: any) => (
            option.value
        ));

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
                value={selectedDoctors.map((id) => {
                    const option = doctorOptions.find((o) =>
                        o.value === id); 
                    return option
                }).filter(o => o !== undefined)}
                placeholder="Select doctors"
            />
        </div>
    );
};

export default DoctorSelect;