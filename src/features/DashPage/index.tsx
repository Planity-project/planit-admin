import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table } from "antd";
import {
  LikeOutlined,
  UserOutlined,
  LoginOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Line, Pie } from "@ant-design/plots";
import api from "@/util/api";

type Post = {
  id: number;
  title: string;
  author: string;
  views: number;
  like: number;
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    loginCount: 0,
    suspendedUsers: 0,
  });
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loginTrend, setLoginTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, postsRes, trendRes] = await Promise.all([
          api.get("/admin/dashboard/stats"),
          api.get("/admin/dashboard/popular-posts"),
          api.get("/admin/dashboard/login-trend?range=7d"),
        ]);

        setStats(statsRes.data);
        setPopularPosts(postsRes.data);
        setLoginTrend(trendRes.data);
      } catch (error) {}
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "제목",
      dataIndex: "title",
      render: (text: string) =>
        text?.length > 10 ? `${text.slice(0, 10)}...` : text || "제목 없음",
    },
    {
      title: "작성자",
      dataIndex: "author",
      render: (author: string) => author || "작성자 정보 없음",
    },
    {
      title: "조회수",
      dataIndex: "views",
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "좋아요 수",
      dataIndex: "like",
      render: (value: number) => value.toLocaleString(),
    },
  ];

  const loginChartConfig = {
    data: loginTrend,
    xField: "date",
    yField: "count",
    smooth: true,
    height: 300,
    autoFit: true,
  };

  const pieChartData = popularPosts.map((post) => ({
    type: post.title?.slice(0, 10) || "제목 없음",
    value: post.like || 0,
  }));

  const pieChartConfig = {
    appendPadding: 10,
    data: pieChartData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      content: (datum: any) =>
        `${datum.type} ${(Number(datum.percent) * 100).toFixed(1)}%`,
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}
      >
        관리자 대시보드
      </h1>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="총 가입자"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="현재 접속 중"
              value={stats.activeUsers}
              prefix={<LoginOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="누적 접속 수"
              value={stats.loginCount}
              prefix={<LoginOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="정지 유저"
              value={stats.suspendedUsers}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "24px" }}>
        <Col span={12}>
          <Card title="최근 7일 접속자 수 추이">
            <Line {...loginChartConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="게시글 좋아요 분포">
            <Pie {...pieChartConfig} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card title="인기 게시글">
            <Table
              dataSource={popularPosts}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
