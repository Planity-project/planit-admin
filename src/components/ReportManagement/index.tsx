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
  reason: string;
  createdAt: string;
  reported_user_id: number;
  reporter?: {
    id: number;
    nickname?: string;
    name?: string;
  };
  reported_content?: string;
}

interface Props {
  data: ReportData[];
  target_type: "comment" | "user";
}

const ReportManagement = ({ data, target_type }: Props) => {
  const router = useRouter();

  const [report, setReport] = useState<ReportData[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [order, setOrder] = useState<"DESC" | "ASC">("DESC");

  // 최초 데이터 설정
  useEffect(() => {
    setReport(data);
  }, [data]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 신고 처리
  const handleReportAdd = async () => {
    const selectedReports = report.filter((item) =>
      selectedRowKeys.includes(item.id)
    );

    try {
      await Promise.all(
        selectedReports.map((item) => api.patch(`/reports/${item.id}/handle`))
      );

      message.success("신고가 성공적으로 처리되었습니다.");

      const updatedReport = report.filter(
        (item) => !selectedRowKeys.includes(item.id)
      );

      setReport(updatedReport);
      setSelectedRowKeys([]);
    } catch (error) {
      message.error("신고 처리 중 문제가 발생했습니다.");
    }
  };

  // 삭제 처리
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
      render: (text: string) => {
        return text || "내용 없음";
      },
      width: "35%",
    },
    {
      title: "신고자",
      dataIndex: "reporterId",
      key: "reporterId",
      render: (_: any, record: any) => {
        const nickname =
          record?.reporter?.nickname || record?.reporter?.name || "알 수 없음";
        return nickname;
      },
      width: "10%",
    },
    {
      title: "신고일",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, record) => {
        const dateStr = record.createdAt;
        if (!dateStr) return "";
        const parsed =
          typeof dateStr === "string" ? new Date(dateStr) : dateStr;
        return parsed.toLocaleString("ko-KR", { hour12: false });
      },
      sorter: (a: ReportData, b: ReportData) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
        <div>타입: {target_type === "comment" ? "댓글" : "회원"}</div>
        <div className="manage-total-num">총 {report.length}건</div>
        <Select
          value={order}
          options={sortOptions}
          style={{ width: 120 }}
          onChange={(value) => {
            setOrder(value);
          }}
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
