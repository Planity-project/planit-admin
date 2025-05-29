import { useEffect, useMemo, useState } from "react";
import { Button, Select, Table, message } from "antd";
import { UserManageStyled } from "./styled";
import clsx from "clsx";
import api from "@/util/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/router";
import TitleCompo from "@/components/TitleCompo";
import { AxiosError } from "axios";

const UserManage = () => {
  const [userOrder, setUserOrder] = useState("DESC");
  const [notiOrder, setNotiOrder] = useState("DESC");
  const [sortKey, setSortKey] = useState("createdAt");
  const [users, setUsers] = useState<any[]>([]);
  const [sortedUsers, setSortedUsers] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const router = useRouter();
  const { query } = router;

  const rawType = query.type;
  const type = Array.isArray(rawType) ? rawType[0] : rawType || "user";

  const titleMap: { [key: string]: string } = {
    user: "회원 관리",
    album: "앨범 회원 관리",
    blacklist: "블랙리스트 회원 관리",
  };

  const pageTitle = titleMap[type] || "회원 관리";

  const getUserList = async () => {
    if (type === "album" && selectedAlbumId === null) {
      return;
    }

    try {
      let res;
      if (type === "album" && selectedAlbumId !== null) {
        res = await api.get("/users/albumUser", {
          params: { albumId: selectedAlbumId },
        });
      } else if (type === "blacklist") {
        res = await api.get("/users/blacklist");
      } else {
        res = await api.get("/users");
      }

      const data = res.data;
      const mapped = data.map((x: any) => ({
        key: x.id,
        id: x.id,
        email: x.email,
        user: x.nickname || "이름 없음",
        report_count: x.report_count || 0,
        status: x.status,
        user_type: x.user_type,
        createdAt: x.joinedDate || x.createdAt,
      }));

      setUsers(mapped);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
      }
    }
  };

  useEffect(() => {
    getUserList();
  }, [type]);

  const sortUsers = () => {
    let sorted = [...users];

    if (sortKey === "createdAt") {
      sorted.sort((a, b) =>
        userOrder === "DESC"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  useEffect(() => {
    sortUsers();
  }, [userOrder, notiOrder, sortKey, users]);

  const handleDownloadExcel = () => {
    const excelData = users.map((user) => ({
      순서: user.id,
      아이디: user.email,
      신고횟수: user.report_count,
      가입일: user.createdAt,
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
      getUserList();
      setSelectedRowKeys([]);
    } catch (err) {
      message.error("회원 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

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
      onHeaderCell: () => ({
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
      onHeaderCell: () => ({
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
      createdAt: x?.createdAt,
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
        <TitleCompo title={pageTitle} />
        <div>
          <Button className="manage-delete-button" onClick={WithdrawUser}>
            회원 탈퇴
          </Button>
        </div>
      </div>
      <div className="manage-select-box">
        <Select
          value={userOrder}
          options={option1}
          onChange={(e) => {
            setUserOrder(e);
            setSortKey("createdAt");
          }}
        />
        <Select
          value={notiOrder}
          options={option2}
          onChange={(e) => {
            setNotiOrder(e);
            setSortKey("report_count");
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
