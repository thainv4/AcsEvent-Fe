import axiosClient from "./axiosClient";

export interface AttendancePaginationRequest {
  phongBanId: number;
  pageNumber?: number;
  pageSize?: number;
}

const attendanceApi = {
  getByPhongban: (phongBanId: number, pageNumber: number = 1, pageSize: number = 10) => {
    return axiosClient.post(`/AcsEvent/attendance-by-phongban?pageNumber=${pageNumber}&pageSize=${pageSize}`, phongBanId);
  },
};
export default attendanceApi;
