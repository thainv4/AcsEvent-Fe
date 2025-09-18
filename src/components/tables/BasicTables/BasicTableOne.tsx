import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { useEffect, useState } from "react";
import { AttendanceDto } from "../../../api/dtos";
import attendanceApi from "../../../api/attendanceApi";

// Define the table data using the interface

export default function BasicTableOne() {
  const [attendanceData, setAttendanceData] = useState<AttendanceDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching attendance data...");
        
        const response = await attendanceApi.getByPhongban(1);
        console.log("API Response:", response);
        console.log("Response data:", response.data);

        // Check if response has data
        if (response.data) {
          // If response.data is already in the correct format (AttendanceDto[])
          if (Array.isArray(response.data)) {
            console.log("Direct array format detected");
            setAttendanceData(response.data);
          } 
          // If response.data has nested structure, extract it
          else if (response.data.success && Array.isArray(response.data.data)) {
            console.log("Nested success format detected");
            setAttendanceData(response.data.data);
          }
          // Handle other possible formats
          else {
            console.warn("Unrecognized data format:", response.data);
            setAttendanceData([]);
            setError("Dữ liệu không đúng định dạng");
          }
        } else {
          console.warn("No data in response");
          setAttendanceData([]);
          setError("Không có dữ liệu");
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setError(`Không thể tải dữ liệu chấm công: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (attendanceData.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <p className="text-gray-500">Không có dữ liệu chấm công</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Mã chấm công
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Họ và Tên
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ngày
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Giờ vào
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Giờ ra
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {attendanceData.map((attendance, index) => (
              <TableRow key={`${attendance.macc}-${index}`}>
                <TableCell>
                  <span className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {attendance.macc}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {attendance.name}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {new Date(attendance.date).toLocaleDateString("vi-VN")}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {attendance.firstin ? new Date(attendance.firstin).toLocaleTimeString("vi-VN", { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : '-'}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {attendance.lastout ? new Date(attendance.lastout).toLocaleTimeString("vi-VN", { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
