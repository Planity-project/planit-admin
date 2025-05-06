import LoginPage from "@/features/LoginPage";

const Login = () => {
  return <LoginPage />;
};

Login.getLayout = (page: React.ReactNode) => page;

export default Login;
