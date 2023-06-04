import React, { useEffect, useMemo, useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { Patient as PatientModel } from "../models/patient";
import { Button } from 'react-bootstrap';
import { FaPlus, FaSort } from "react-icons/fa";
import styleUtils from "../styles/utils.module.css";
import stylePatient from "../styles/ViewPatient.module.css";
import FileUploadDialog from './FileUploadDialog';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Plot from 'react-plotly.js';
import Select, { components } from 'react-select';

interface PatientData {
    '(WBC) Leucocite': string;
    'Neutrofile %': string;
    'Monocite %': string;
    'Eosinofile %': string;
    'Basofile %': string;
    'Limfocite %': string;
    'Neutrofile #': string;
    'Monocite #': string;
    'Eosinofile #': string;
    'Basofile #': string;
    'Limfocite #': string;
    '(RBC) Hematii': string;
    'Hemoglobina': string;
    '(HCT) Hematocrit': string;
    '(MCV) Volum mediu eritrocitar': string;
    '(MCH) Hemoglobina eritrocitara medie': string;
    'medie de hemoglob. eritrocitara': string;
    '(RDW-CV) Coef de variatie al indicelui de ditributie al eritrocitelor': string;
    'eritrocitelor': string;
    '(PLT) Trombocite': string;
    '(PDW) Indice de distributie a trombocitelor': string;
    '(MPV) Volum mediu trombocitar': string;
    'Placetocrit': string;
    'date': string;
}

interface PatientNoduleData{
    cnp: string,
    Hemoleucograma_completa: PatientData[];
}

interface ViewPatientProps {
    patient: PatientModel,
    goBack: () => void;
}

const ViewPatientData: React.FC<ViewPatientProps> = ({ patient, goBack }) => {
    const {
        name,
        cnp,
    } = patient;

    const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filesUploaded, setFilesUploaded] = useState<File[]>([]);

    const handleAddDataPdf = () => {
        setShowFileUploadDialog(true);
    };

    const handleFilesUploaded = (files: File[]) => {
        setFilesUploaded(files);
        setShowFileUploadDialog(false);
        goBack();
    };

    const [patientData, setPatientData] = useState<PatientNoduleData | null>(null);

    useEffect(() => {
        const fetchNoduleDetails = async () => {
            try {
                const response = await axios.get(`/api/patients/${patient._id}`);
                setPatientData(response.data);
                if (response.data.Hemoleucograma_completa) {
                    setAllColumns(Object.keys(response.data.Hemoleucograma_completa[0]));
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchNoduleDetails();
    }, [patient._id]);

    const [sortConfig, setSortConfig] = useState<{key: keyof PatientData, direction: 'ascending' | 'descending'} | null>(null);

    const sortedData = React.useMemo(() => {
        let sortableData = [...patientData?.Hemoleucograma_completa ?? []];
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
    }, [patientData, sortConfig]);

    function requestSort(key: keyof PatientData) {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    const [selectedColumnForPlot, setSelectedColumnForPlot] = useState<keyof PatientData | null>(null);

    const handleSelectChangeForPlot = (selectedOption: { value: string; label: string } | null) => {
        if (selectedOption) {
            const value = selectedOption.value as keyof PatientData;
            setSelectedColumnForPlot(value);
        }
    }

    const [allColumns, setAllColumns] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    const options = useMemo(() => {
        const options = allColumns.map(column => ({ value: column, label: column }));
        options.unshift({ value: "selectAll", label: "Select All" });
        return options;
    }, [allColumns]);

    const Option = (props: any) => {
        return (
            <div>
            <components.Option {...props}>
                <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
                <label>{props.label}</label>
            </components.Option>
            </div>
        );
    };

    const MultiValue = (props: any) => {
        return null;
    };
    
return (
    <>
        {showFileUploadDialog &&
            <FileUploadDialog caller = "PDF"
                onDismiss={() => setShowFileUploadDialog(false)} 
                onFilesUploaded={handleFilesUploaded}
                patientCNP={cnp} 
            />
        }
        <MdArrowBack
            style={{height: '5vh', width: '5vw', overflow: 'auto'}}
            onClick={goBack}
        /> <br/>
        <label className={`${stylePatient.patientDetails}`}>
            Name: {name}
        </label>
        <label className={`${stylePatient.patientDetails}`}>
            CNP: {cnp}
        </label>
        <Button
            className={`mb-4 ${styleUtils.blockTopCenter} ${styleUtils.flexCenter}`}
            onClick={(e) => {
                handleAddDataPdf();
                e.stopPropagation();
            }}>
            <FaPlus />
            Add new data pdf
        </Button>
        <br/>
        <Select
            onChange={handleSelectChangeForPlot}
            options={Object.keys(patientData?.Hemoleucograma_completa[0] || {}).map(key => 
                ({ value: key, label: key }))}
            isSearchable
            placeholder="Select the plot"
            styles={{ 
                control: (provided) => ({ 
                    ...provided, 
                    width: 200
                }) 
            }}
        />
        <br/>
        {selectedColumnForPlot && patientData && (
            <><Plot
                data={[
                    {
                        x: patientData.Hemoleucograma_completa.map(item => item.date),
                        y: patientData.Hemoleucograma_completa.map(item => 
                            parseFloat(item[selectedColumnForPlot].split(' ')[0])),
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'red'},
                    },
                ]}
                layout={{width: 400, height: 350, title: `${selectedColumnForPlot}`}}
            />
            <br/></>
        )}
        <Select
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            value={selectedOptions}
            components={{
                Option: Option,
                MultiValue: MultiValue,
            }}
            name="columns"
            className="basic-multi-select"
            classNamePrefix="select"
            options={options}
            onChange={(selectedOptions) => {
                if (!selectedOptions) {
                    setSelectedOptions([]);
                    setSelectedColumns([]);
                    return;
                }
                const selectedValues = selectedOptions.map(option => option.value);
                if (selectedValues.includes('selectAll') && (!selectedColumns.includes('selectAll') || selectedOptions.length > selectedColumns.length)) {
                    setSelectedOptions(options);
                    setSelectedColumns(allColumns);
                }
                else if (selectedColumns.includes('selectAll') && !selectedValues.includes('selectAll')) {
                    setSelectedOptions([]);
                    setSelectedColumns([]);
                }
                else {
                    setSelectedOptions([...selectedOptions]);
                    setSelectedColumns(selectedValues);
                }
            }}
            placeholder="Select the columns"
            styles={{ 
                control: (provided) => ({ 
                    ...provided, 
                    width: 200
                }) 
            }}
        />
        <br/><br/>
        <Table striped bordered hover size="sm" 
                className={`${stylePatient.patientDataTable}`}>
            <thead className="thead-dark">
                <tr>
                {selectedColumns.map((column) => (
                    <th scope="col" onClick={() => requestSort('date')} key={column}>
                        <FaSort className={`text-muted ms-auto`} />
                        {column}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {patientData && patientData.Hemoleucograma_completa && 
                sortedData.map((Hemoleucograma_completa, index) => (
                    <tr key={index}>
                        {selectedColumns.map((column) => (
                            <td key={column}>{(Hemoleucograma_completa as any)[column]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
        <br/>
    </>
  );
};

export default ViewPatientData;