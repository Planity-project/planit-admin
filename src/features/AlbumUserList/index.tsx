import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Button, message } from "antd";
import api from "@/util/api";
import TitleCompo from "@/components/TitleCompo";
import { AlbumUserManageStyled } from "./styled";

const AlbumUserList = () => {
  const router = useRouter();
  const { albumId } = router.query;
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (!albumId) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/albumusers", {
          params: { albumId },
        });

        setUsers(res.data);
      } catch (err) {
        message.error("앨범 유저 목록을 불러오지 못했습니다.");
      }
    };

    fetchUsers();
  }, [albumId]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDeleteUsers = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("삭제할 유저를 선택해주세요.");
      return;
    }

    try {
      await Promise.all(
        selectedRowKeys.map((id) => api.delete(`/users/${id}`))
      );
      message.success("선택된 유저가 삭제되었습니다.");
      setUsers(users.filter((user) => !selectedRowKeys.includes(user.id)));
      setSelectedRowKeys([]);
    } catch (err) {
      console.error("유저 삭제 실패:", err);
      message.error("유저 삭제 중 오류가 발생했습니다.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "이메일", dataIndex: "email", key: "email" },
    { title: "닉네임", dataIndex: "nickname", key: "nickname" },
    { title: "상태", dataIndex: "status", key: "status" },
    {
      title: "관리",
      key: "manage",
      render: (record: any) => (
        <Button
          onClick={() => router.push(`/memberedit/${record.id}?from=album`)}
        >
          상세
        </Button>
      ),
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

  return (
    <AlbumUserManageStyled>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <TitleCompo title={`앨범 ID ${albumId}의 유저 목록`} />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <Button
            type="primary"
            disabled={!selectedRowKeys.length}
            onClick={handleDeleteUsers}
          >
            선택 유저 삭제
          </Button>
        </div>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{ pageSize: 10 }}
      />
    </AlbumUserManageStyled>
  );
};

export default AlbumUserList;
