import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

interface FileUploadDialogProps {
    onDismiss: () => void,
    onFilesUploaded: (files: File[]) => void,
}

const FileUploadDialog = ({ onDismiss, onFilesUploaded }: FileUploadDialogProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

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
                    <input type="file" multiple onChange={handleFileChange} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleFileUpload}>Upload</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default FileUploadDialog;
