import { useEffect, useState } from "react";
import { Input, Button, message, Radio } from "antd";
import api from "@/util/api";
import { MemberEditStyled } from "./styled";

interface MemberEditProps {
  id: number;
}

const MemberEdit = ({ id }: MemberEditProps) => {
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        const user = res.data;
        setNickname(user.nickname);
        setStatus(user.status);
        setEmail(user.email);
        setUserType(user.type);
        setReportCount(user.report_count);
      } catch (err) {
        message.error("회원 정보를 불러오지 못했습니다.");
      }
    };
    fetchUser();
  }, [id]);

  const handleSave = async () => {
    try {
      await api.patch(`/users/${id}`, { nickname, status });
      message.success("회원 정보가 수정되었습니다.");
    } catch (err) {
      message.error("수정에 실패했습니다.");
    }
  };

  return (
    <MemberEditStyled className="edit-wrap">
      <h2 className="edit-title">회원 정보 수정</h2>

      <p className="info-text">
        <b>이메일:</b> {email}
      </p>
      <p className="info-text">
        <b>로그인 유형:</b> {userType}
      </p>
      <p className="info-text">
        <b>신고 횟수:</b> {reportCount}
      </p>

      <div className="edit-box">
        <label>닉네임</label>
        <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
      </div>

      <div className="edit-box">
        <label className="add-status">상태</label>
        <Radio.Group value={status} onChange={(e) => setStatus(e.target.value)}>
          <Radio value="active">활동</Radio>
          <Radio value="stop">정지</Radio>
        </Radio.Group>
      </div>

      <Button type="primary" onClick={handleSave}>
        저장
      </Button>
    </MemberEditStyled>
  );
};

export default MemberEdit;
