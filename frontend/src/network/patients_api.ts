import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { PatientWithoutHemoleucograma, PatientWithHemoleucograma } from "../models/patient";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export async function fetchPatients(): Promise<PatientWithoutHemoleucograma[]> {
    const response = await fetchData("/api/patients", { method: "GET" });
    return response.json();
}

export interface PatientInput {
    name: string,
    cnp: string,
    doctors: string[],
    description: string,
}

export async function createPatient(patient: PatientInput): Promise<PatientWithoutHemoleucograma> {
    const response = await fetchData("/api/patients",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patient),
        });
    return response.json();
}

export async function updatePatient(patientId: string, patient: PatientInput): Promise<PatientWithoutHemoleucograma> {
    const response = await fetchData("/api/patients/" + patientId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patient),
        });
    return response.json();
}

export async function deletePatient(patientId: string) {
    await fetchData("/api/patients/" + patientId, { method: "DELETE" });
}

export async function getPatientWithoutHemoleucograma(patientId: string): Promise<PatientWithoutHemoleucograma> {
    const response = await fetchData("/api/patients/" + patientId, { method: "GET" });
    return response.json();
}

export async function getPatientWithHemoleucograma(patientId: string): Promise<PatientWithHemoleucograma> {
    const response = await fetchData("/api/patients/" + patientId, { method: "GET" });
    return response.json();
}