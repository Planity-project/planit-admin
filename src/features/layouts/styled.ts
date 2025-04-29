import styled from "styled-components";
import { Layout } from "antd";

const { Sider } = Layout;

export const CustomSider = styled(Sider)`
  background-color: rgba(94, 234, 96, 0.3) !important;
  color: #fff;

  .ant-menu {
    background-color: transparent !important;
    color: #fff;
  }

  .ant-menu-item-selected {
    background-color: #d2e4f8 !important;
  }

  .ant-menu-item:hover {
    background-color: rgba(94, 234, 96, 0.3) !important;
  }
`;
