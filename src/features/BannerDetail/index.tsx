import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/util/api";
import { Button, Card, Descriptions } from "antd";
import TitleCompo from "@/components/TitleCompo";
import { BannerDetailStyled } from "./styled";
import clsx from "clsx";

interface Banner {
  id: number;
  title: string;
  image_path: string;
}

const BannerDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    if (id) {
      const getBanner = async () => {
        try {
          const res = await api.get(`/banner/${id}`);
          setBanner(res.data);
        } catch (err) {
          console.error("배너 상세 불러오기 실패", err);
        }
      };
      getBanner();
    }
  }, [id]);

  if (!banner) return <div>로딩 중...</div>;

  return (
    <BannerDetailStyled className={clsx("banner-detail-wrap")}>
      <div className="detail-head">
        <TitleCompo title="배너 상세" />
        <Button onClick={() => router.back()}>목록으로</Button>
      </div>
      <div className="detail-box">
        <Card className="card-box">
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="ID">{banner.id}</Descriptions.Item>
            <Descriptions.Item label="제목">{banner.title}</Descriptions.Item>
            <Descriptions.Item label="배너 미리보기">
              <img
                className="detail-image"
                src={`http://localhost:5001${banner.image_path}`}
                alt={banner.title}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </BannerDetailStyled>
  );
};

export default BannerDetail;
