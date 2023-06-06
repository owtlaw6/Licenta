import React, { useEffect, useState } from 'react';
import { Request } from '../models/request';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Row } from 'react-bootstrap';
import styles from "../styles/adminButtons.module.css";
import styleButtons from "../styles/signUpButtons.module.css";
import AssistantPageLoggedIn from "../components/AssistantPageLoggedIn";
import UsersList from './UsersList';
import DoctorPageLoggedInView from './DoctorPageLoggedInView';

export const fetchRequests = async (): Promise<Request[]> => {
    const response = await axios.get('/api/requests');
    return response.data;
};

const approveRequest = (request: Request) => {
    return axios.post(`/api/requests/approve/${request._id}`, {
        username: request.username,
        email: request.email,
        password: request.password,
        role: request.role,
    });
};

const AdminRequestList: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);

    const [activeInterface, setActiveInterface] = useState('requests');

    const showRequestsList = () => setActiveInterface('requests');
    const showPatientsList = () => setActiveInterface('patients');
    const showUsersList = () => setActiveInterface('users');
    const showDoctorView = () => setActiveInterface('doctors');
    

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const fetchedRequests = await fetchRequests();
            setRequests(fetchedRequests);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprove = async (request: Request) => {
        approveRequest(request)
            .then(() => {
                setRequests(requests.filter((r) => r._id !== request._id));
                toast.success("Request approved.");
            })
            .catch((error) => {
                toast.error("An error occurred while approving the request.");
                console.error(error);
            });
    };

    const handleDeny = async (request: Request) => {
        try {
            await axios.delete(`/api/requests/deny/${request._id}`);
            toast.success("Request denied successfully.");
            setRequests(requests.filter((r) => r._id !== request._id));
        } catch (error) {
            console.error(error);
            toast.error("Failed to deny the request.");
        }
    };

    const requestsList = <>
        <ToastContainer />
        <h2>Registration Requests</h2>
        <br/><br/>
        <table className="table">
            <thead className="thead-dark">
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((request) => (
                    <tr key={request._id}>
                        <td>{request.username}</td>
                        <td>{request.email}</td>
                        <td>{request.role}</td>
                        <td>
                            <Button className={styles.buttonsAdmin}
                                onClick={() => {
                                    console.log('Approve button clicked');
                                    handleApprove(request)
                                }}>
                                Approve
                            </Button>
                            <Button
                                onClick={() => {
                                    console.log('Deny button clicked');
                                    handleDeny(request)
                                }}>
                                Deny
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>

    return (
        <>
            <Row xs={1} md={2} xl={3} className={`g-4 ${ styleButtons.buttonsGrid2}`}>
                <Button type="submit" className={styleButtons.buttonMargin} onClick={showRequestsList}>
                    Requests List
                </Button>
                <Button type="submit" className={styleButtons.buttonMargin} onClick={showPatientsList}>
                    Patients List
                </Button>
                <Button type="submit" className={styleButtons.buttonMargin} onClick={showUsersList}>
                    Users List
                </Button>
                <Button type="submit" className={styleButtons.buttonMargin} onClick={showDoctorView}>
                    Doctor View
                </Button>
            </Row>
            {activeInterface === 'requests' && (
                requestsList
            )}
            {activeInterface === 'patients' && (
                <AssistantPageLoggedIn />
            )}
            {activeInterface === 'users' && (
                <UsersList />
            )}
            {activeInterface === 'doctors' && (
                <DoctorPageLoggedInView />
            )}
        </>
    );
};

export default AdminRequestList;