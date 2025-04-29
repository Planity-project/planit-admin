import { Layout } from "antd";
import Sidebar from "./sidebar";
import ContentWrapper from "@/styles/contentwrapper";
const { Content } = Layout;

interface Props {
  children: React.ReactNode;
}
const AdminLayout = ({ children }: Props) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "24px" }}>
        <ContentWrapper>{children}</ContentWrapper>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
