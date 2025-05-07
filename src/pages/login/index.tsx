import LoginPage from "@/features/LoginPage";

const Login = () => {
  return (
    <div>
      <LoginPage />
    </div>
  );
};

Login.getLayout = (page: React.ReactNode) => page;

export default Login;
