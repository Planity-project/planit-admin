import { Button, Select, Table, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReportManageStyled } from "./styled";
import clsx from "clsx";
import TitleCompo from "../TitleCompo";
import api from "@/util/api";
import type { ColumnsType } from "antd/es/table";

interface ReportData {
  id: number;
  content: string;
  reason: string;
  reporterId: string;
  created_at: string;
  reported_user_id: number;
  // status: "pending" | "processed"; // 신고 상태 추가 가능
}

interface Props {
  data: ReportData[];
  target_type: "comment" | "chapter";
}

const ReportManagement = ({ data, target_type }: Props) => {
  const router = useRouter();

  const [report, setReport] = useState<ReportData[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [order, setOrder] = useState<"DESC" | "ASC">("DESC");

  useEffect(() => {
    setReport(data);
    console.log("받아온 신고 데이터 (ReportManagement):", data);
  }, [data]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // ✅ 신고 처리 API 호출
  const handleReportAdd = async () => {
    const selectedReports = report.filter((item) =>
      selectedRowKeys.includes(item.id)
    );

    try {
      await Promise.all(
        selectedReports.map((item) => api.patch(`/reports/${item.id}/handle`))
      );

      message.success("신고가 성공적으로 처리되었습니다.");

      // 처리된 항목은 리스트에서 제거
      const updatedReport = report.filter(
        (item) => !selectedRowKeys.includes(item.id)
      );
      setReport(updatedReport);

      setSelectedRowKeys([]);
    } catch (error) {
      console.error("신고 처리 실패:", error);
      message.error("신고 처리 중 문제가 발생했습니다.");
    }
  };

  // ❌ 선택 삭제
  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((id) => api.delete(`/reports/${id}`))
      );
      const filtered = report.filter(
        (item: ReportData) => !selectedRowKeys.includes(item.id)
      );
      message.success("선택된 신고가 삭제되었습니다.");
      setReport(filtered);
      setSelectedRowKeys([]);
    } catch (err) {
      console.error("삭제 중 에러 발생:", err);
      message.error("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDetailClick = (id: number) => {
    router.push(`/reports/${target_type}/${id}`);
  };

  const columns: ColumnsType<ReportData> = [
    {
      key: "num",
      title: "번호",
      dataIndex: "num",
      render: (_: any, __: any, index: number) => index + 1,
      width: "8%",
    },
    { title: "신고 이유", dataIndex: "reason", key: "reason", width: "27%" },

    {
      title: "신고 대상",
      dataIndex: "reported_content",
      key: "reported_content",
      render: (text: string) => text || "내용 없음",
      width: "35%",
    },
    {
      title: "신고자",
      dataIndex: "reporterId",
      key: "reporterId",
      render: (_: any, record: any) =>
        record?.reporter?.nickname || record?.reporter?.name || "알 수 없음",
      width: "10%",
    },
    {
      title: "신고일",
      dataIndex: "created_at",
      key: "created_at",
      render: (_: any, record) =>
        record.created_at.replace("T", " ").slice(0, 19),
      sorter: (a: ReportData, b: ReportData) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      width: "20%",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  useEffect(() => {
    const sorted = [...data].sort((a, b) =>
      order === "DESC"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    setReport(sorted);
  }, [data, order]);

  const sortOptions = [
    { value: "DESC", label: "최신순" },
    { value: "ASC", label: "오래된순" },
  ];

  return (
    <ReportManageStyled className={clsx("report-wrap")}>
      <div className="report-head">
        <TitleCompo title="신고 관리" />
        <div className="report-active-btn">
          <Button
            type="primary"
            disabled={!selectedRowKeys.length}
            onClick={handleReportAdd}
          >
            신고 처리
          </Button>
          <Button
            type="primary"
            danger
            onClick={handleDelete}
            disabled={!selectedRowKeys.length}
          >
            신고 삭제
          </Button>
        </div>
      </div>
      <div className="manage-info">
        <div>{target_type === "comment" ? "댓글" : "게시글"}</div>
        <div className="manage-total-num">총 {report.length}건</div>
        <Select
          value={order}
          options={sortOptions}
          style={{ width: 120 }}
          onChange={(value) => setOrder(value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={report}
        rowSelection={rowSelection}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => handleDetailClick(record.id),
        })}
      />
    </ReportManageStyled>
  );
};

export default ReportManagement;
