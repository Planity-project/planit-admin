import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaUsers, FaUserCheck, FaSignInAlt, FaUserSlash } from "react-icons/fa";
import api from "@/util/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
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
        console.log("postsRes.data:", postsRes.data);
        setStats(statsRes.data);
        setPopularPosts(postsRes.data);
        setLoginTrend(trendRes.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        로딩중...
      </div>
    );

  // 인기 게시글 댓글수 Pie 차트 데이터
  const likePieData = popularPosts.map((post: any) => ({
    name:
      post.title && post.title.length > 10
        ? post.title.slice(0, 10) + "..."
        : post.title || "제목 없음",
    value: post.likeCount || 0,
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">관리자 대시보드</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          새로고침
        </button>
      </header>

      {/* 통계 카드 */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={<FaUsers />}
          label="총 가입자"
          value={stats.totalUsers}
          color="blue"
        />
        <StatCard
          icon={<FaUserCheck />}
          label="현재 접속 중"
          value={stats.activeUsers}
          color="green"
        />
        <StatCard
          icon={<FaSignInAlt />}
          label="누적 접속 수"
          value={stats.loginCount}
          color="purple"
        />
        <StatCard
          icon={<FaUserSlash />}
          label="정지 유저"
          value={stats.suspendedUsers}
          color="red"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 접속 추이 라인 + 바 차트 복합 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            최근 7일 접속자 수 추이
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={loginTrend}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="date" stroke="#5550bd" />
              <YAxis stroke="#5550bd" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
              <Bar dataKey="count" fill="#82ca9d" barSize={20} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 인기 게시글 리스트 */}
        <table className="w-full text-left text-gray-700">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2">제목</th>
              <th className="py-2">작성자</th>
              <th className="py-2">조회수</th>
              <th className="py-2">좋아요 수</th>
            </tr>
          </thead>
          <tbody>
            {popularPosts.map((post: any) => (
              <tr
                key={post.id}
                className="border-b border-gray-200 hover:bg-gray-100 transition cursor-pointer"
              >
                <td className="py-2">
                  {post.title && post.title.length > 10
                    ? post.title.slice(0, 10) + "..."
                    : post.title || "제목 없음"}
                </td>
                <td>작성자 정보 없음</td>{" "}
                {/* 작성자 API에서 안 내려오니 일단 빈칸이나 고정 텍스트 */}
                <td>{post.views.toLocaleString()}</td>
                <td>{post.like.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 인기 게시글 댓글수 Pie 차트 */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">게시글 댓글 분포</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={likePieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent! * 100).toFixed(0)}%`
                }
              >
                {likePieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "green" | "purple" | "red";
}) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div
      className={`flex items-center gap-4 p-6 rounded-xl shadow-md ${colorMap[color]}`}
    >
      <div
        className={`p-4 rounded-full bg-white text-3xl shadow-lg drop-shadow-md ${colorMap[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-lg font-medium">{label}</p>
        <p className="text-4xl font-extrabold">{value.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Dashboard;
