import clsx from "clsx";
import { ReportDetailStyled } from "./styled";
import api from "@/util/api";
import router from "next/router";
import { Button, Modal, message } from "antd";

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

interface Props {
  data: ReportData;
  target_type: "comment" | "user";
}

const ReportDetail = ({ data, target_type }: Props) => {
  console.log("📌 ReportDetail 렌더링됨");
  console.log("🧾 data:", data);
  console.log("🎯 target_type:", target_type);

  const handleDelete = async () => {
    Modal.confirm({
      title: "삭제하시겠습니까?",
      content: "삭제한 내용은 복구할 수 없습니다.",
      okText: "삭제",
      cancelText: "취소",
      okButtonProps: {
        style: { backgroundColor: "rgb(83, 183, 232, 0.6)" },
      },
      async onOk() {
        try {
          await api.delete(`/reports/${data.id}`);

          message.success(
            `${
              target_type === "comment" ? "댓글" : "회원"
            } 신고가 삭제되었습니다.`
          );
          router.push(`/reports/${target_type}`);
        } catch (error) {
          console.error("삭제 실패", error);
          message.error("삭제 중 오류가 발생했습니다.");
        }
      },
    });
  };

  const handleProcessReport = async () => {
    Modal.confirm({
      title: "신고 처리하시겠습니까?",
      content: "신고되면 사용자에게 알림이 갑니다.",
      okText: "예",
      cancelText: "아니오",
      okButtonProps: {
        style: { backgroundColor: "rgb(83, 183, 232, 0.6)" },
      },
      async onOk() {
        try {
          await api.patch(`/reports/${data.id}/handle`);
          message.success("신고 처리되었습니다.");
          router.push(`/reports/${target_type}`);
        } catch (error) {
          console.error("신고 처리 실패", error);
          message.error("신고 처리 중 오류가 발생했습니다.");
        }
      },
    });
  };

  return (
    <ReportDetailStyled className={clsx("reportdetail-wrap")}>
      <div className="report-header">
        <div>{target_type === "comment" ? "댓글" : "회원"} 신고 상세</div>
        <Button>목록으로</Button>
      </div>

      <div className="row">
        <div className="label">신고자 ID</div>
        <div className="value">{data.reporter.id}</div>
      </div>

      <div className="row">
        <div className="label">신고자</div>
        <div className="value">{data.reporter.nickname}</div>
      </div>

      <div className="row">
        <div className="label">신고 이유</div>
        <div className="value">{data.reason}</div>
      </div>

      <div className="row">
        <div className="label">
          신고 내용 ({target_type === "comment" ? "댓글" : "회원"})
        </div>
        <div className="value">{data.reported_content}</div>
      </div>

      <div className="row">
        <div className="label">신고된 글 작성자</div>
        <div className="value">{data.reported_user_id}</div>
      </div>

      <div className="row">
        <div className="label">신고일</div>
        <div className="value">
          {data.createdAt?.replace("T", " ").slice(0, 19) ?? ""}
        </div>
      </div>

      <div className="report-btn">
        <button className="add" onClick={handleProcessReport}>
          신고 처리
        </button>
        <button className="remove" onClick={handleDelete}>
          신고 삭제
        </button>
      </div>
    </ReportDetailStyled>
  );
};

export default ReportDetail;
