import React, { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import Plot from "react-plotly.js";
import { Patient as PatientModel } from "../models/patient";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { MdArrowBack } from "react-icons/md";

interface ComparePatientsViewProps {
  goBack: () => void;
  patients: PatientModel[];
}

interface PatientData {
  [key: string]: string;
}

interface PatientNoduleData {
  cnp: string;
  Hemoleucograma_completa: PatientData[];
}

const ComparePatientsView: React.FC<ComparePatientsViewProps> = ({ goBack, patients }) => {
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [patientsData, setPatientsData] = useState<{ [key: string]: PatientNoduleData }>({});
  const [selectedColumnForPlot, setSelectedColumnForPlot] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchPatientData = async () => {
      const fetchedData: { [key: string]: PatientNoduleData } = {};
      for (const patientId of selectedPatients) {
        try {
          const response = await axios.get(`/api/patients/${patientId}`);
          fetchedData[patientId] = response.data;
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      }
      setPatientsData(fetchedData);
    };
    if (selectedPatients.length > 0) fetchPatientData();
  }, [selectedPatients]);

  const patientOptions = patients.map((p) => ({ value: p._id, label: p.name }));
  const allColumns = useMemo(() => {
    if (selectedPatients.length === 0) return [];
    return Object.keys(patientsData[selectedPatients[0]]?.Hemoleucograma_completa?.[0] || {});
  }, [selectedPatients, patientsData]);

  return (
    <div>
      <MdArrowBack
          style={{height: '5vh', width: '5vw', overflow: 'auto'}}
          onClick={goBack}
      /> <br/>
      <h3>Compare Patients</h3>
      <Select
        isMulti
        options={patientOptions}
        onChange={(selected) => setSelectedPatients(selected.map((s) => s.value))}
        placeholder="Select patients"
      />
      <br />
      <Select
        options={allColumns.map((col) => ({ value: col, label: col }))}
        onChange={(selected) => setSelectedColumnForPlot(selected?.value || null)}
        placeholder="Select plot column"
      />
      <br />
      <Select
        isMulti
        options={allColumns.map((col) => ({ value: col, label: col }))}
        onChange={(selected) => setSelectedColumns(selected.map((s) => s.value))}
        placeholder="Select table columns"
      />
      <br />
      {selectedColumnForPlot && (
        <Plot
          data={selectedPatients.map((patientId) => ({
            x: patientsData[patientId]?.Hemoleucograma_completa.map((d) => d.no),
            y: patientsData[patientId]?.Hemoleucograma_completa.map((d) => parseFloat(d[selectedColumnForPlot] || "0")),
            type: "scatter",
            mode: "lines+markers",
            name: patients.find((p) => p._id === patientId)?.name,
          }))}
          layout={{ width: 800, height: 400, title: selectedColumnForPlot }}
        />
      )}
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Test Name</th>
            {selectedPatients.map((patientId) => (
              <th key={patientId}>{patients.find((p) => p._id === patientId)?.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedColumns.map((col) => (
            <tr key={col}>
              <td>{col}</td>
              {selectedPatients.map((patientId) => (
                <td key={patientId}>{patientsData[patientId]?.Hemoleucograma_completa?.[0]?.[col] || "N/A"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ComparePatientsView;



