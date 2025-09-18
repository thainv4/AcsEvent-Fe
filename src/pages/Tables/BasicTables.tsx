import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import Dropdown from "../../components/common/Dropdown";

export default function BasicTables() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | number>(1);

  const departmentOptions = [
    { label: "Phòng công nghệ thông tin", value: 1 },
    { label: "Phòng nhân sự", value: 2 },
    { label: "Phòng kế toán", value: 3 },
    { label: "Phòng marketing", value: 4 },
    { label: "Phòng kinh doanh", value: 5 },
  ];

  const handleDepartmentChange = (value: string | number) => {
    setSelectedDepartment(value);
    // TODO: Reload data with new department
    console.log("Selected department:", value);
  };

  const selectedDepartmentLabel = departmentOptions.find(
    (dept) => dept.value === selectedDepartment
  )?.label || "Phòng công nghệ thông tin";

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="THEO DÕI CHẤM CÔNG" />
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
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
