import React, { useEffect, useState } from 'react';
import { Request } from '../models/request';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    return (
        <div>
            <ToastContainer />
            <h2>Registration Requests</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request._id}>
                            <td>{request.username}</td>
                            <td>{request.email}</td>
                            <td>{request.role}</td>
                            <td>
                                <button onClick={() => {
                                    console.log('Approve button clicked'); 
                                    handleApprove(request)}}>
                                        Approve
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminRequestList;