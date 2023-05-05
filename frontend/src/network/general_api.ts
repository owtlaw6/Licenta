import axios from "axios";

export interface Doctor {
    _id: string;
    name: string;
}

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await axios.get("/api/users/doctors");
    const users: any[] = response.data;
  
    const doctors = users
      .map((doctor) => ({
        _id: doctor._id,
        name: doctor.username,
      }));
    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};