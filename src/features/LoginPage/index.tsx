import { useState } from "react";
import { useRouter } from "next/router";
import { LoginPageStyled } from "./styled";
import api from "@/util/api";
import clsx from "clsx";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const LoginPage = () => {
  // 비밀번호 토글
  const [toggle, setToggle] = useState(true);

  // 아이디
  const [email, setEmail] = useState("");

  // 비밀번호
  const [password, setPassword] = useState("");

  // 오류 메시지
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  // 로그인 버튼 클릭시
  const handleLoginSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("아이디(이메일)를 입력해주세요");
      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력해주세요");
      return;
    }

    try {
      // 🚨 백엔드에서 직접 res.send 응답하면 response.data 없음
      const response = await api.post("/admin/login", { email, password });

      // 응답 상태 직접 확인 못 할 수 있으므로 예외 없으면 성공으로 간주
      console.log("로그인 성공");
      setErrorMessage("");
      sessionStorage.setItem("isAdminLoggedIn", "true");
      router.push("/dashboard");
    } catch (error: any) {
      // NestJS에서 실패 시 res.status(401).send("실패") 하면 여기로 떨어짐
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        "아이디 또는 비밀번호를 확인해주세요";

      setErrorMessage(`로그인 실패: ${msg}`);
      console.error("로그인 오류:", error);
    }
  };

  return (
    <LoginPageStyled className={clsx("login-wrap")}>
      <div className="login-box">
        <h3 className="login-title">관리자 로그인</h3>
        <form className="login-form">
          {/* 아이디 */}
          <div>
            <input
              className="login-id"
              type="email"
              name="email"
              placeholder="아이디"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="login-pw-box">
            <input
              className="login-pw"
              type={toggle ? "password" : "text"}
              name="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            {/* 토글 버튼 */}
            {toggle ? (
              <EyeInvisibleOutlined
                className="toggleBtn"
                onClick={(e) => {
                  e.preventDefault();
                  setToggle(!toggle);
                }}
              />
            ) : (
              <EyeOutlined
                className="toggleBtn"
                onClick={(e) => {
                  e.preventDefault();
                  setToggle(!toggle);
                }}
              />
            )}
          </div>

          {/* 오류 메시지 */}
          {errorMessage && (
            <div className="login-errorMessage">{errorMessage}</div>
          )}

          {/* 로그인 버튼 */}
          <button className="login-btn" onClick={handleLoginSubmit}>
            로그인
          </button>
        </form>
      </div>
    </LoginPageStyled>
  );
};

export default LoginPage;
