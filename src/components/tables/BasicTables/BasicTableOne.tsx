import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

import {useEffect, useState} from "react";
import {AttendanceDto} from "../../../api/dtos";
import attendanceApi from "../../../api/attendanceApi";

// Helper functions để kiểm tra thời gian
const isLateCheckIn = (timeString: string): boolean => {
    if (!timeString) return false;
    const time = new Date(timeString);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    // Muộn nếu sau 7:30 (7 * 60 + 30 = 450 phút)
    const timeInMinutes = hours * 60 + minutes;
    return timeInMinutes > 450; // 7:30 = 450 phút
};

const isEarlyCheckOut = (timeString: string): boolean => {
    if (!timeString) return false;
    const time = new Date(timeString);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    // Sớm nếu trước 16:30 (16 * 60 + 30 = 990 phút)
    const timeInMinutes = hours * 60 + minutes;
    return timeInMinutes < 990; // 16:30 = 990 phút
};

// Define the table data using the interface

interface BasicTableOneProps {
    phongBanId?: number;
}

export default function BasicTableOne({phongBanId = 1}: BasicTableOneProps) {
    const [attendanceData, setAttendanceData] = useState<AttendanceDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15);
    const [pagination, setPagination] = useState<{
        pageIndex: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
    } | null>(null);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching attendance data for phongBanId:", phongBanId);

                const response = await attendanceApi.getByPhongban(phongBanId, currentPage, pageSize);
                console.log("API Response:", response);
                console.log("Response data:", response.data);

                // Check if response has data with new pagination format
                if (response.data) {
                    console.log("Response data structure:", {
                        hasSucceeded: 'succeeded' in response.data,
                        succeededValue: response.data.succeeded,
                        hasData: 'data' in response.data,
                        dataIsArray: Array.isArray(response.data.data),
                        responseKeys: Object.keys(response.data)
                    });

                    // Try multiple formats for pagination response
                    // Format 1: succeeded === true
                    if (response.data.succeeded === true && Array.isArray(response.data.data)) {
                        console.log("✅ Pagination format detected (succeeded = true)");
                        const pageInfo = {
                            pageIndex: response.data.pageIndex,
                            pageSize: response.data.pageSize,
                            totalPages: response.data.totalPages,
                            totalRecords: response.data.totalRecords
                        };
                        console.log("Page info:", pageInfo);
                        setPagination(pageInfo);
                        setAttendanceData(response.data.data);
                    }
                    // Format 2: has data array regardless of succeeded value
                    else if (response.data.data && Array.isArray(response.data.data) && response.data.data.length >= 0) {
                        console.log("✅ Data array found (flexible format)");
                        const pageInfo = {
                            pageIndex: response.data.pageIndex || 1,
                            pageSize: response.data.pageSize || 15,
                            totalPages: response.data.totalPages || 1,
                            totalRecords: response.data.totalRecords || response.data.data.length
                        };
                        console.log("Page info:", pageInfo);
                        setPagination(pageInfo);
                        setAttendanceData(response.data.data);
                    }
                    // Format 3: Legacy direct array format
                    else if (Array.isArray(response.data)) {
                        console.log("✅ Direct array format detected");
                        setAttendanceData(response.data);
                    }
                    // Format 4: Check if succeeded is false
                    else if (response.data.succeeded === false) {
                        console.log("❌ API returned succeeded = false");
                        setAttendanceData([]);
                        setError(response.data.message || "API trả về lỗi");
                    }
                    // Handle unrecognized formats
                    else {
                        console.warn("❌ Unrecognized data format. Response structure:", response.data);
                        console.warn("Keys available:", Object.keys(response.data));
                        setAttendanceData([]);
                        setError("Dữ liệu không đúng định dạng");
                    }
                } else {
                    console.warn("❌ No data in response");
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
    }, [phongBanId, currentPage, pageSize]);

    if (loading) {
        return (
            <div
                className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-8 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (attendanceData.length === 0) {
        return (
            <div
                className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-8 text-center">
                    <p className="text-gray-500">Không có dữ liệu chấm công</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-4 font-semibold text-gray-500 text-center text-base dark:text-gray-400"
                            >
                                STT
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-4 font-semibold text-gray-500 text-start text-base dark:text-gray-400"
                            >
                                Mã nhân viên
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-4 font-semibold text-gray-500 text-start text-base dark:text-gray-400"
                            >
                                Họ và Tên
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-4 font-semibold text-gray-500 text-start text-base dark:text-gray-400"
                            >
                                Giờ vào
                            </TableCell>

                            <TableCell
                                isHeader
                                className="px-5 py-4 font-semibold text-gray-500 text-start text-base dark:text-gray-400"
                            >
                                Giờ ra
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {attendanceData.map((attendance, index) => (
                            <TableRow key={`${attendance.manv}-${index}`}>
                                <TableCell>
                  <span className="px-4 py-4 text-gray-500 text-center text-base dark:text-gray-400 font-medium">
                    {index + 1}
                  </span>
                                </TableCell>

                                <TableCell>
                  <span className="px-4 py-4 text-gray-500 text-start text-base dark:text-gray-400">
                    {attendance.manv}
                  </span>
                                </TableCell>

                                <TableCell className="px-4 py-4 text-gray-500 text-start text-base dark:text-gray-400">
                                    {attendance.name}
                                </TableCell>

                                <TableCell
                                    className={`px-4 py-4 text-start text-base ${
                                        attendance.firstIn && isLateCheckIn(attendance.firstIn)
                                            ? 'text-red-600 font-semibold dark:text-red-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                  <span
                      title={
                          attendance.firstIn && isLateCheckIn(attendance.firstIn)
                              ? 'Vào muộn (sau 7:30)'
                              : undefined
                      }
                  >
                    {attendance.firstIn ? new Date(attendance.firstIn).toLocaleTimeString("vi-VN", {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '-'}
                  </span>
                                </TableCell>

                                <TableCell
                                    className={`px-4 py-4 text-start text-base ${
                                        attendance.lastOut && isEarlyCheckOut(attendance.lastOut)
                                            ? 'text-red-600 font-semibold dark:text-red-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                  <span
                      title={
                          attendance.lastOut && isEarlyCheckOut(attendance.lastOut)
                              ? 'Ra sớm (trước 16:30)'
                              : undefined
                      }
                  >
                    {attendance.lastOut ? new Date(attendance.lastOut).toLocaleTimeString("vi-VN", {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '-'}
                  </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {pagination && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        {/* Records info */}
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Hiển
                            thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, pagination.totalRecords)} trên {pagination.totalRecords} bản
                            ghi
                        </div>

                        {/* Pagination controls */}
                        <div className="flex items-center space-x-2">
                            {/* Previous button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    currentPage === 1 || loading
                                        ? 'text-gray-400 cursor-not-allowed dark:text-gray-600'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
                                }`}
                            >
                                Trước
                            </button>

                            {/* Page numbers */}
                            <div className="flex items-center space-x-1">
                                {Array.from({length: Math.min(5, pagination.totalPages)}, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            disabled={loading}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                pageNum === currentPage
                                                    ? 'bg-blue-600 text-white'
                                                    : loading
                                                        ? 'text-gray-400 cursor-not-allowed dark:text-gray-600'
                                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Next button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages || loading}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    currentPage === pagination.totalPages || loading
                                        ? 'text-gray-400 cursor-not-allowed dark:text-gray-600'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
                                }`}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}