import TitleCompo from "@/components/TitleCompo";
import { BannerPageStyled } from "./styled";
import { useEffect, useState } from "react";
import { Button, Modal, Table, message } from "antd";
import { useRouter } from "next/router";
import api from "@/util/api";
import clsx from "clsx";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface Banner {
  id: number;
  title: string;
  image_path: string;
}

const BannerPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const router = useRouter();

  // 실제 배너 데이터 요청
  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await api.get("/banner");
        setBanners(res.data);
      } catch (err) {
        console.error("배너 불러오기 실패", err);
      }
    };

    getBanners();
  }, []);

  // 한 행 삭제
  const handleDelete = async (e: React.MouseEvent, id: any) => {
    e.preventDefault();
    Modal.confirm({
      title: "배너를 삭제하겠습니까?",
      icon: <ExclamationCircleOutlined />,
      content: "삭제시 복구할 수 없습니다.",
      okText: "예",
      cancelText: "아니오",
      okButtonProps: {
        style: { backgroundColor: "#c47ad7" },
      },
      async onOk() {
        try {
          const response = await api.delete(`/banner/${id}`);

          if (response.status === 200) {
            setBanners((prevBanners) =>
              prevBanners.filter((banner) => banner.id !== id)
            );
            message.success("배너가 삭제되었습니다.");
          } else {
            message.error("삭제를 실패했습니다. 다시 시도해주세요.");
          }
        } catch (error) {
          console.error("삭제 중 오류 발생:", error);
          message.error("오류가 발생했습니다. 다시 시도해주세요.");
        }
      },
    });
  };

  const columns = [
    {
      title: "번호",
      dataIndex: "num",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "배너 미리보기",
      dataIndex: "image_path",
      render: (_: any, record: Banner) => {
        return (
          <img
            src={`http://localhost:5001${record.image_path}`}
            alt={record.title}
            className="banner-img"
          />
        );
      },
    },
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "관리",
      render: (banner: any) => (
        <div className="banner-management">
          <Button
            onClick={(e) => {
              handleDelete(e, banner.id);
              e.stopPropagation();
            }}
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  return (
    <BannerPageStyled className={clsx("banner-wrap")}>
      <div className="banner-box">
        <TitleCompo title="배너 관리" />
        <Button type="primary" onClick={() => router.push("/bannerform")}>
          배너 등록
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={banners}
        rowKey="id"
        pagination={false}
        bordered
        onRow={(record) => ({
          onClick: () => {
            router.push(`/bannerdetail/${record.id}`);
          },
        })}
        locale={{
          emptyText:
            "등록된 배너가 없습니다. 상단의 [배너 등록] 버튼을 눌러 추가해보세요.",
        }}
        rowClassName="banner-row"
      />
    </BannerPageStyled>
  );
};

export default BannerPage;
