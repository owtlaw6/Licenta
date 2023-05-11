import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { User as UserModel } from '../models/user';
import * as UsersApi from "../network/users_api";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditUserDialog from "./AddEditUserDialog";
import User from './User';
import { MdSearch } from "react-icons/md";

const UsersList = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [showUsersLoadingError, setShowUsersLoadingError] = useState(false);

    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserModel | null>(null);

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        async function loadUser() {
            try {
                setShowUsersLoadingError(false);
                setUsersLoading(true);
                const users = await UsersApi.fetchUsers();
                setUsers(users);
            } catch (error) {
                console.error(error);
                setShowUsersLoadingError(true);
            } finally {
                setUsersLoading(false);
            }
        }
        loadUser();
    }, []);

    async function deleteUser(user: UserModel) {
        try {
            await UsersApi.deleteUser(user._id);
            setUsers(users.filter(existingUser => existingUser._id !== user._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const usersGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {Array.isArray(users) && users.filter((user) =>
                `${user.username} ${user.email} ${user.role}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase()))
                .map(user => (
                <Col key={user._id}>
                    <User caller="admin"
                        user={user}
                        className={styles.note}
                        onUserClicked={setUserToEdit}
                        onDeleteUserClicked={deleteUser}
                    />
                </Col>
            ))}
        </Row>

    return (
        <>
            <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search users"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <MdSearch className={styles.searchIcon} />
            </div>

            <Button
                className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                onClick={() => setShowAddUserDialog(true)}>
                <FaPlus />
                Add new user
            </Button>
            {usersLoading && <Spinner animation='border' variant='primary' />}
            {showUsersLoadingError && <p>Something went wrong. Please refresh the page.</p>}
            {!usersLoading && !showUsersLoadingError &&
                <>
                    {users.length > 0
                        ? usersGrid
                        : <p>You don't have any users yet</p>
                    }
                </>
            }
            {showAddUserDialog &&
                <AddEditUserDialog caller="assistant"
                    onDismiss={() => setShowAddUserDialog(false)}
                    onUserSaved={(newUser) => {
                        setUsers([...users, newUser]);
                        setShowAddUserDialog(false);
                    }}
                />
            }
            {userToEdit &&
                <AddEditUserDialog caller="assistant"
                    userToEdit={userToEdit}
                    onDismiss={() => setUserToEdit(null)}
                    onUserSaved={(updatedUser) => {
                        setUsers(users.map(existingUser => existingUser._id ===
                            updatedUser._id ? updatedUser : existingUser));
                        setUserToEdit(null);
                    }}
                />
            }
        </>
    );
}

export default UsersList;