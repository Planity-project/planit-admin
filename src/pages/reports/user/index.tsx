import ReportManagement from "@/components/ReportManagement";
import { useEffect, useState } from "react";
import api from "@/util/api";

const UserREports = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getReports = async () => {
      const res = await api.get("/reports");
      const filtered = res.data.filter(
        (report: any) => report.target_type === "user"
      );
      setData(filtered);
    };
    getReports();
  }, []);

  return <ReportManagement data={data} target_type="user" />;
};

export default UserREports;
