import styles from "../styles/Note.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { User as UserModel } from "../models/user";
import { MdDelete } from "react-icons/md";

interface UserProps {
    user: UserModel,
    onUserClicked: (user: UserModel) => void,
    onDeleteUserClicked: (user: UserModel) => void,
    className?: string,
    caller: string,
}

const User = ({user, onUserClicked, onDeleteUserClicked, className, caller }: UserProps) => {
    const {
        username,
        email,
        role,
    } = user;

    return (
        <>
            <Card
                className={`${styles.noteCard} ${className}`}
                onClick={() => onUserClicked(user)}>
                <Card.Body className={styles.cardBody}>
                    <Card.Title className={styleUtils.flexCenter}>
                        {username}
                        {(caller === 'admin') && (
                            <MdDelete
                                className="text-muted ms-auto"
                                onClick={(e) => {
                                    onDeleteUserClicked(user);
                                    e.stopPropagation();
                                }}
                            />
                        )}
                        
                    </Card.Title>
                    <Card.Title className={styleUtils.flexCenter}>
                        {email ? email : "cevaaaa"}
                    </Card.Title>
                    <Card.Title className={styleUtils.flexCenter}>
                        {role}
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    )
}

export default User;