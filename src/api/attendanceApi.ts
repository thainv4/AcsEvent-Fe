import axiosClient from "./axiosClient";

const attendanceApi = {
  getByPhongban: (phongBanId: number) => {
    return axiosClient.post("/AcsEvent/attendance-by-phongban", phongBanId);
  },
};
export default attendanceApi;
