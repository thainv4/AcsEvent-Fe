import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import Dropdown from "../../components/common/Dropdown";
import phongBanApi, { PhongBanDto } from "../../api/phongBanApi";

export default function BasicTables() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | number>(1);
  const [phongBanList, setPhongBanList] = useState<PhongBanDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch danh sách phòng ban
  useEffect(() => {
    const fetchPhongBan = async () => {
      try {
        setLoading(true);
        const response = await phongBanApi.getAll();
        console.log("PhongBan API Response:", response);
        
        if (response.data && response.data.data) {
          setPhongBanList(response.data.data);
          // Set phòng ban đầu tiên làm mặc định nếu có dữ liệu
          if (response.data.data.length > 0) {
            setSelectedDepartment(response.data.data[0].maPb);
          }
        }
      } catch (error) {
        console.error("Error fetching phong ban:", error)
        setSelectedDepartment(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPhongBan();
  }, []);

  // Convert phòng ban data thành dropdown options
  const departmentOptions = phongBanList.map((pb) => ({
    label: pb.tenPb,
    value: pb.maPb,
  }));

  const handleDepartmentChange = (value: string | number) => {
    setSelectedDepartment(value);
    console.log("Selected department ID:", value);
  };

  const selectedDepartmentLabel = phongBanList.find(
    (pb) => pb.maPb === selectedDepartment
  )?.tenPb || "Chọn phòng ban";

  if (loading) {
    return (
      <>
        <PageMeta
          title="THEO DÕI CHẤM CÔNG HÀNG NGÀY"
          description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />
        <PageBreadcrumb pageTitle={`THEO DÕI CHẤM CÔNG NGÀY ${new Date().toLocaleDateString('vi-VN')}`} />
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Đang tải danh sách phòng ban...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="THEO DÕI CHẤM CÔNG"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={`THEO DÕI CHẤM CÔNG NGÀY ${new Date().toLocaleDateString('vi-VN')}`} />
      <div className="space-y-6">
        <ComponentCard 
          title={selectedDepartmentLabel}
          rightElement={
            <Dropdown
              options={departmentOptions}
              selected={selectedDepartment}
              onSelect={handleDepartmentChange}
              placeholder="Chọn phòng ban"
              className="w-56"
            />
          }
        >
          <BasicTableOne phongBanId={selectedDepartment as number} />
        </ComponentCard>
      </div>
    </>
  );
}
