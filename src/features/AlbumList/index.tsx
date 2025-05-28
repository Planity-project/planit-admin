import { useEffect, useMemo, useState } from "react";
import { Button, Select, Table } from "antd";
import { UserManageStyled } from "./styled";
import clsx from "clsx";
import api from "@/util/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/router";
import TitleCompo from "@/components/TitleCompo";
import { App as AntdApp } from "antd";

const AlbumList = () => {
  const { message } = AntdApp.useApp();
  const [userOrder, setUserOrder] = useState("DESC");
  const [notiOrder, setNotiOrder] = useState("DESC");
  const [sortKey, setSortKey] = useState("createdAt");
  const [albums, setAlbums] = useState<any[]>([]);
  const [sortedAlbums, setSortedAlbums] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();

  const getAlbumList = async () => {
    try {
      const res = await api.get("/users/albumlist");

      const data = res.data;

      const mapped = data.map((x: any) => ({
        key: x.id,
        id: x.id,
        title: x.album_title || "제목 없음",
        leader: x.leader || "리더 없음",
        paid: x.is_paid ? "결제 완료" : "미결제",
        createdAt: x.created_at,
      }));

      setAlbums(mapped);
    } catch (err) {
      message.error("앨범 목록을 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    getAlbumList();
  }, []);

  const sortAlbums = () => {
    let sorted = [...albums];

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
    }

    setSortedAlbums(sorted);
  };

  useEffect(() => {
    sortAlbums();
  }, [userOrder, notiOrder, sortKey, albums]);

  const handleDownloadExcel = () => {
    const excelData = albums.map((album) => ({
      번호: album.id,
      타이틀: album.title,
      리더: album.leader,
      결제여부: album.paid,
      생성일: album.createdAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "앨범목록");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "앨범목록.xlsx");
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
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      key: "title",
      title: "타이틀",
      dataIndex: "title",
    },
    {
      key: "leader",
      title: "리더",
      dataIndex: "leader",
    },
    {
      key: "paid",
      title: "결제여부",
      dataIndex: "paid",
    },
    {
      key: "manage",
      title: "관리",
      render: (data: any) => (
        <Button
          onClick={() => router.push(`/users/albumuserlist?albumId=${data.id}`)}
        >
          관리
        </Button>
      ),
    },
  ];

  const list = useMemo(() => sortedAlbums, [sortedAlbums]);

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
        <TitleCompo title="앨범 관리" />
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
        <div className="manage-total-num">총 {list.length}건</div>
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

export default AlbumList;
