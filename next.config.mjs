import withTM from "next-transpile-modules";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ["localhost"],
  },
  compiler: {
    styledComponents: true,
  },
};

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
];

export default withTM(transpileModules)(nextConfig);
