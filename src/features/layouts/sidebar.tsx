import { Menu } from "antd";
import { useRouter } from "next/router";
import { sidebarMenus } from "@/util/template";
import { CustomSider } from "./styled";

const Sidebar = () => {
  const router = useRouter();

  return (
    <CustomSider width={200}>
      <Menu
        mode="inline"
        selectedKeys={[router.pathname]}
        defaultOpenKeys={["/users"]}
        style={{ height: "100%", borderRight: 0 }}
        items={sidebarMenus}
      />
    </CustomSider>
  );
};

export default Sidebar;
