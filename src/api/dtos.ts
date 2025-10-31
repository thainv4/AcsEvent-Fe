export interface AttendanceDto {
  manv: string;
  name: string;
  date: string;
  firstIn: string | null;
  lastOut: string | null;
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


