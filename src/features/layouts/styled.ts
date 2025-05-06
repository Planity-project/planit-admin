import styled from "styled-components";
import { Layout } from "antd";

const { Sider } = Layout;

export const CustomSider = styled(Sider)`
  background-color: rgb(83, 183, 232, 0.6) !important;
  color: #fff;

  .ant-menu {
    background-color: transparent !important;
    color: #fff;
  }

  .ant-menu-item-selected {
    background-color: #d2e4f8 !important;
  }

  .ant-menu-item:hover {
    background-color: rgb(83, 183, 232, 0.9) !important;
  }
`;
