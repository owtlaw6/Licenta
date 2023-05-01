// src/components/AdminRequestList.tsx
import React, { useEffect, useState } from 'react';
import { Request } from '../models/request';
import axios from 'axios';

export const fetchRequests = async (): Promise<Request[]> => {
    const response = await axios.get('/api/requests');
    return response.data;
};

export const approveRequest = async (requestId: string): Promise<void> => {
    console.log(`Sending request to approve requestId: ${requestId}`);
    const response = await axios.post(`/api/requests/approve/${requestId}`);
    return response.data;
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

    const handleApprove = async (requestId: string) => {
        try {
            await approveRequest(requestId);
            loadRequests();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
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
                                    handleApprove(request._id)}}>
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