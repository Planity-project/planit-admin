import { useEffect, useMemo, useState } from "react";
import { Button, Select, Table, message } from "antd";
import { UserManageStyled } from "./styled";
import clsx from "clsx";
import api from "@/util/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/router";
import TitleCompo from "@/components/TitleCompo";

const UserManage = () => {
  const [userOrder, setUserOrder] = useState("DESC");
  const [notiOrder, setNotiOrder] = useState("DESC");
  const [sortKey, setSortKey] = useState("created_at");
  const [users, setUsers] = useState<any[]>([]);
  const [sortedUsers, setSortedUsers] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();

  const getUserList = async () => {
    try {
      // 유저 정보를 불러오는 axios 요청
      const res = await api.get("/users");
      const data = res.data;

      console.log(data);

      const mapped = data.map((x: any) => ({
        key: x.id,
        id: x.id,
        email: x.email,
        user: x.nickname || "이름 없음",
        report_count: x.report_count || 0,
        status: x.status,
        user_type: x.user_type,
        created_at: x.joinedDate || x.created_at, // 가입 날짜 필드명 확인
      }));

      setUsers(mapped);
    } catch (err) {
      console.error("유저 불러오기 실패", err);
    }
  };

  // 유저정보
  useEffect(() => {
    getUserList();
  }, []);

  // 유저 정렬하기
  const sortUsers = () => {
    let sorted = [...users];

    if (sortKey === "created_at") {
      sorted.sort((a, b) =>
        userOrder === "DESC"
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortKey === "report_count") {
      sorted.sort((a, b) =>
        notiOrder === "DESC"
          ? b.report_count - a.report_count
          : a.report_count - b.report_count
      );
    } else if (sortKey === "user") {
      sorted.sort((a, b) => {
        const nameA = a.user.toLowerCase();
        const nameB = b.user.toLowerCase();
        return userOrder === "ASC"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }
    setSortedUsers(sorted);
  };

  // 유저정렬
  useEffect(() => {
    sortUsers();
  }, [userOrder, notiOrder, sortKey, users]);

  // 엑셀 다운로드
  const handleDownloadExcel = () => {
    const excelData = users.map((user) => ({
      순서: user.id,
      아이디: user.email,
      신고횟수: user.report_count,
      가입일: user.created_at,
      상태: user.status?.props?.children,
      권한: user.user_type,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "회원목록");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "회원목록.xlsx");
  };

  // 회원삭제
  const WithdrawUser = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("삭제할 회원을 선택해주세요.");
      return;
    }

    try {
      await api.delete("/users/admin/delete", {
        data: { userIds: selectedRowKeys },
      });
      message.success("선택한 회원을 완전히 삭제했습니다.");
      getUserList(); // 목록 다시 불러오기
      setSelectedRowKeys([]); // 선택 초기화
    } catch (err) {
      console.error("회원 삭제 실패:", err);
      message.error("회원 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // 테이블 rowSelection 설정
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const col: any = [
    {
      key: "num",
      title: "번호",
      dataIndex: "num",
    },
    {
      key: "email",
      title: "아이디",
      dataIndex: "email",
    },
    {
      key: "user",
      title: "이름",
      dataIndex: "user",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: (column: any) => ({
        onClick: () => {
          setSortKey("user");
          setUserOrder(userOrder === "DESC" ? "ASC" : "DESC");
        },
      }),
    },
    {
      key: "report_count",
      title: "신고 횟수",
      dataIndex: "report_count",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: (column: any) => ({
        onClick: () => {
          setSortKey("report_count");
          setNotiOrder(notiOrder === "DESC" ? "ASC" : "DESC");
        },
      }),
    },
    {
      key: "status",
      title: "상태",
      dataIndex: "status",
    },
    {
      key: "setting",
      title: "관리",
      render: (data: any) => (
        <Button
          onClick={() => {
            router.push(`/memberedit/${data.id}`);
          }}
        >
          관리
        </Button>
      ),
    },
  ];

  const list = useMemo(() => {
    return sortedUsers.map((x: any, i: number) => ({
      num: i + 1,
      key: x?.id,
      id: x?.id,
      email: x?.email,
      user: x?.user,
      report_count: x?.report_count,
      status:
        x?.status === "stop" ? (
          <div className="stop">정지</div>
        ) : (
          <div className="run">활동</div>
        ),
      user_type: x?.user_type,
      created_at: x?.created_at,
    }));
  }, [sortedUsers]);

  const option1 = [
    { value: "DESC", label: "최신순" },
    { value: "ASC", label: "오래된순" },
  ];
  const option2 = [
    { value: "DESC", label: "신고 많은순" },
    { value: "ASC", label: "신고 적은순" },
  ];

  return (
    <UserManageStyled className={clsx("manage-wrap")}>
      <div className="manage-title-box">
        <TitleCompo title="회원 관리" />
        <div>
          <Button
            onClick={() => {
              router.push("/memberadd");
            }}
          >
            회원추가
          </Button>
          <Button className="manage-delete-button" onClick={WithdrawUser}>
            회원삭제
          </Button>
        </div>
      </div>
      <div className="manage-select-box">
        <Select
          value={userOrder}
          options={option1}
          onChange={(e) => {
            setUserOrder(e);
            setSortKey("created_at"); // 최신순/오래된순 정렬 기준을 가입일로 변경
          }}
        />
        <Select
          value={notiOrder}
          options={option2}
          onChange={(e) => {
            setNotiOrder(e);
            setSortKey("noti");
          }}
        />
      </div>
      <div className="manage-info">
        <div className="manage-total-num">총 {list.length}명</div>
        <Button onClick={handleDownloadExcel}>엑셀</Button>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={col}
        dataSource={list}
        rowKey="id"
      />
    </UserManageStyled>
  );
};
export default UserManage;
