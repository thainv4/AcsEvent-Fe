export interface AttendanceDto {
  manv: string;
  name: string;
  date: string;
  firstin: string | null;
  lastout: string | null;
}

export interface AttendanceApiResponse {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  succeeded: boolean;
  message: string | null;
  errors: string | null;
  data: AttendanceDto[];
}


