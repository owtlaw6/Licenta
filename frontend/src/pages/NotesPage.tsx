import { Container } from "react-bootstrap";
import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import AdminPageLoggedInView from "../components/AdminRequestList"
import { User } from "../models/user";
import styles from "../styles/NotesPage.module.css";

interface NotesPageProps {
    loggedInUser: User | null,
}   

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
    if (loggedInUser) {
        console.log('User Role:', );
    } else {
        console.log('User not logged in');
    }
    
    return (
        <Container className={styles.notesPage}>
            <>
                {
                    loggedInUser
                    ? (loggedInUser.role === "Doctor" || loggedInUser.role === "Technician")
                        ? <NotesPageLoggedInView />
                        : <AdminPageLoggedInView />
                    : <NotesPageLoggedOutView />
                }
            </>
        </Container>
    );
}

export default NotesPage;