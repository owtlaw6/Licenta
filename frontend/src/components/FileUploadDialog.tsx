import { Button, Modal } from "react-bootstrap";
import { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FileUploadDialogProps {
    onDismiss: () => void,
    onFilesUploaded: (files: File[]) => void,
}

const FileUploadDialog = ({ onDismiss, onFilesUploaded }: FileUploadDialogProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

    const handleFileUpload = async () => {
        const formData = new FormData();
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
            <Modal show onHide={onDismiss}>
                <Modal.Header closeButton>
                    <Modal.Title>Add CT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleFileUpload}>Upload</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default FileUploadDialog;
