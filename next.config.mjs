import path from "path";
import withTM from "next-transpile-modules";

const transpileModules = [
  "@ant-design/icons-svg",
  "@ant-design/icons",
  "rc-tree",
  "rc-util",
  "rc-pagination",
  "rc-picker",
  "rc-table",
  "rc-input",
  "@rc-component/util",
  "antd",
  "rc-checkbox",
  "rc-dialog",
  "rc-select",
  "rc-upload",
  "rc-tooltip",
  "rc-tabs",
  // 필요한 패키지 더 추가
];

const nextConfig = {
  basePath: "/admin",
  assetPrefix: "/admin",
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
    domains: ["localhost", "13.209.89.42", "15.164.52.122"],
  },
  webpack(config) {
    config.resolve.modules.push(path.resolve("./src"));
    return config;
  },
};

export default withTM(transpileModules)(nextConfig);
