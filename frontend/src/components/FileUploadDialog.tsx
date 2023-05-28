import { Button, Modal } from "react-bootstrap";
import { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styleUtils from "../styles/utils.module.css";

interface FileUploadDialogProps {
    onDismiss: () => void,
    onFilesUploaded: (files: File[]) => void,
    patientCNP: string,
    caller: string,
}

const FileUploadDialog = ({ onDismiss, onFilesUploaded, patientCNP, caller }: FileUploadDialogProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

    const handleFileUpload = async () => {
        const formData = new FormData();

        formData.append('uploadType', caller);
        formData.append('cnp', patientCNP);

        selectedFiles.forEach(file => {
            formData.append('file', file);
        });
        
        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            onFilesUploaded(selectedFiles);
            toast.success("Upload successfully!");
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <>
            <Modal show onHide={onDismiss} className={styleUtils.fileUploadDialog}>
                { caller === "CT" &&
                    <Modal.Header closeButton>
                        <Modal.Title>Add CT</Modal.Title>
                    </Modal.Header>
                }
                { caller === "PDF" &&
                    <Modal.Header closeButton>
                        <Modal.Title>Add pdf</Modal.Title>
                    </Modal.Header>
                }
                <Modal.Body>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag and drop some files here, or click to select files</p>
                        }
                    </div>
                    <div>
                        <h5>Selected Files:</h5>
                        <ul>
                            {selectedFiles.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleFileUpload} disabled={selectedFiles.length === 0}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default FileUploadDialog;
