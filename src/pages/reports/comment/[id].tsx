import ReportDetailPage from "@/components/ReportDetail";
import api from "@/util/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ReportData {
  id: number;
  reason: string;
  reported_content: string;
  reporter: {
    id: number;
    name: string;
    nickname: string;
  };
  createdAt: string;
  reported_user_id: number;
}

const ReportDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🌀 router.isReady:", router.isReady);
    console.log("🔍 id:", id);

    if (!router.isReady || !id) return;

    const fetchReport = async () => {
      try {
        const res = await api.get(`/reports/${id}`);
        setReport(res.data);
      } catch (error) {
        console.error("신고 데이터를 불러오는 중 오류 발생:", error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [router.isReady, id]);

  if (loading) return <div>로딩 중...</div>;
  if (!report) return <div>해당 신고를 찾을 수 없습니다.</div>;

  return <ReportDetailPage data={report} target_type="comment" />;
};

export default ReportDetail;
