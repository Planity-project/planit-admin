import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table } from "antd";
import {
  LikeOutlined,
  UserOutlined,
  LoginOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Column, Line, Pie } from "@ant-design/plots";
import api from "@/util/api";

const dummyLoginTrend = [
  { date: "2025-05-21", count: 120 },
  { date: "2025-05-22", count: 200 },
  { date: "2025-05-23", count: 150 },
  { date: "2025-05-24", count: 300 },
  { date: "2025-05-25", count: 250 },
  { date: "2025-05-26", count: 400 },
  { date: "2025-05-27", count: 350 },
];

const Dashboard = () => {
  console.log("🚀 Dashboard 컴포넌트 렌더 시작");

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    loginCount: 0,
    suspendedUsers: 0,
  });
  const [popularPosts, setPopularPosts] = useState([]);
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
        console.log(trendRes.data);
      } catch (error) {
        console.error(error);
      }
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
      render: () => "작성자 정보 없음",
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
    data: dummyLoginTrend,
    xField: "date",
    yField: "count",
    smooth: true,
    height: 300,
    autoFit: true,
  };

  const barChartConfig = {
    data: loginTrend,
    xField: "date",
    yField: "count",
    height: 300,
    color: "#1890ff",
  };

  const pieChartData = popularPosts.map((post: any) => ({
    type: post.title?.slice(0, 10) || "제목 없음",
    value: post.likeCount || 0,
  }));

  const pieChartConfig = {
    appendPadding: 10,
    data: pieChartData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      content: (item: any) =>
        `${item.type} ${(item.percent * 100).toFixed(1)}%`,
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
          <Card title="게시글 댓글 분포">
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
