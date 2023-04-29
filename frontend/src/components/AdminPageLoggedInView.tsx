import { FaPlus } from "react-icons/fa";
import { Note as NoteModel } from '../models/note';
import * as NotesApi from "../network/notes_api";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditNoteDialog from "./AddEditNoteDialog";
import Note from './Note';

const AdminPageLoggedInView = () => {
    return (
        <p>Admin is here</p>
    );
}

export default AdminPageLoggedInView;