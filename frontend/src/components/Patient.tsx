import styles from "../styles/Note.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Patient as PatientModel } from "../models/patient";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

interface PatientProps {
    patient: PatientModel,
    onPatientClicked: (patient: PatientModel) => void,
    onDeletePatientClicked: (patient: PatientModel) => void,
    className?: string,
}

const Patient = ({patient, onPatientClicked, onDeletePatientClicked, className }: PatientProps) => {
    const {
        name,
        cnp,
        doctors,
        createdAt,
        updatedAt
    } = patient;

    let createdUpdated: string;
    if (updatedAt > createdAt) {
        createdUpdated = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdated = "Created: " + formatDate(createdAt);
    }

    return (
        <Card
            className={`${styles.noteCard} ${className}`}
            onClick={() => onPatientClicked(patient)}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {name}
                    <MdDelete
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            onDeletePatientClicked(patient);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Title className={styleUtils.flexCenter}>
                    {cnp}
                </Card.Title>
                <Card.Title className={styleUtils.flexCenter}>
                    {doctors}
                </Card.Title>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdated}
            </Card.Footer>
        </Card>
    )
}

export default Patient;