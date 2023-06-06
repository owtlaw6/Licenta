import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { User as UserModel } from '../models/user';
import * as UsersApi from "../network/users_api";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditUserDialog from "./AddEditUserDialog";
import User from './User';
import { MdSearch } from "react-icons/md";
import { FaList, FaSort } from 'react-icons/fa';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import React from 'react';

const UsersList = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [showUsersLoadingError, setShowUsersLoadingError] = useState(false);

    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserModel | null>(null);

    const [searchText, setSearchText] = useState("");

    const [viewMode, setViewMode] = useState("grid");

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    };

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

    const [sortConfig, setSortConfig] = useState<{key: keyof UserModel, direction: 'ascending' | 'descending'} | null>(null);

    const sortedData = React.useMemo(() => {
        let sortableData = [...users ?? []];
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
    }, [users, sortConfig]);

    function requestSort(key: keyof UserModel) {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    const usersGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {Array.isArray(users) && users.filter((user) =>
                `${user.username} ${user.email} ${user.role}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase()))
                .map(user => (
                <Col key={user._id}>
                    <User caller="admin" displayListGrid="grid"
                        user={user}
                        className={styles.note}
                        onUserClicked={setUserToEdit}
                        onDeleteUserClicked={deleteUser}
                    />
                </Col>
            ))}
        </Row>

    const usersList =
        <>
        <Table striped bordered hover size="sm" className="table">
            <thead className="thead-dark">
                <tr>
                    <th scope="col" onClick={() => requestSort('username')}>
                        <FaSort className={`text-muted ms-auto`} />
                        Username
                    </th>
                    <th scope="col" onClick={() => requestSort('email')}>
                        <FaSort className={`text-muted ms-auto`} />
                        Email
                    </th>
                    <th scope="col" onClick={() => requestSort('role')}>
                        <FaSort className={`text-muted ms-auto`} />
                        Role
                    </th>
                </tr>
            </thead>
            <tbody>
            {sortedData.filter((user) =>
                `${user.username} ${user.email} ${user.role}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase()))
                .map(user => (
                    <User caller="admin" displayListGrid="list"
                        user={user}
                        className={styles.note}
                        onUserClicked={setUserToEdit}
                        onDeleteUserClicked={deleteUser}
                    />
                ))}
            </tbody>
        </Table>
    </>

    return (
        <>
            <BsFillGrid3X3GapFill className={`${styleUtils.viewModeButtonsContainerGrid}`} 
                onClick={toggleViewMode} />
            <FaList className={`${styleUtils.viewModeButtonsContainerList}`} 
                onClick={toggleViewMode} />
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
                        ? viewMode === "grid" 
                            ? usersGrid
                            : usersList
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