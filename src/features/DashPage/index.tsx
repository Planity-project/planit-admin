import { DashStyled } from "./styled";
import { Card, CardContent } from "@/components/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from "@/util/api";

const DashBoard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    loginCount: 0,
    suspendedUsers: 0,
  });

  const [popularPosts, setPopularPosts] = useState([]);
  const [loginTrend, setLoginTrend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const statsRes = await api.get("/api/admin/dashboard/stats");
      const postsRes = await api.get("/api/admin/dashboard/popular-posts");
      const trendRes = await api.get(
        "/api/admin/dashboard/login-trend?range=7d"
      );

      setStats(statsRes.data);
      setPopularPosts(postsRes.data);
      setLoginTrend(trendRes.data);
    };

    fetchData();
  }, []);

  return (
    <DashStyled>
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">총 가입자</p>
            <h2 className="text-xl font-bold">{stats.totalUsers}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">현재 접속 중</p>
            <h2 className="text-xl font-bold">{stats.activeUsers}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">누적 접속 수</p>
            <h2 className="text-xl font-bold">{stats.loginCount}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">정지 유저</p>
            <h2 className="text-xl font-bold">{stats.suspendedUsers}</h2>
          </CardContent>
        </Card>
      </div>

      {/* 접속 추이 그래프 */}
      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <h3 className="text-lg font-semibold mb-2">최근 7일 접속자 수</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={loginTrend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 인기 게시글 테이블 */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">인기 게시글</h3>
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">제목</th>
              <th>작성자</th>
              <th>조회수</th>
              <th>댓글수</th>
            </tr>
          </thead>
          <tbody>
            {popularPosts.map((post: any) => (
              <tr key={post.id} className="border-b">
                <td className="py-2">{post.title}</td>
                <td>{post.author}</td>
                <td>{post.views}</td>
                <td>{post.commentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashStyled>
  );
};

export default DashBoard;
