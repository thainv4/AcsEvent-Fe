import axiosClient from "./axiosClient";

export interface PhongBanDto {
  maPb: number;
  tenPb: string;
}

export interface PhongBanResponse {
  message: string;
  data: PhongBanDto[];
}

const phongBanApi = {
  getAll: () => {
    return axiosClient.get<PhongBanResponse>("/PhongBan");
  },
};

export default phongBanApi;
