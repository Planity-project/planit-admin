import ReportManagement from "@/components/ReportManagement";
import { useEffect, useState } from "react";
import api from "@/util/api";

const PostREports = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getReports = async () => {
      const res = await api.get("/reports");
      const filtered = res.data.filter(
        (report: any) => report.target_type === "chapter"
      );
      setData(filtered); // target_type이 "chapter"인 것만 저장
    };
    getReports();
  }, []);

  return <ReportManagement data={data} target_type="chapter" />;
};

export default PostREports;
