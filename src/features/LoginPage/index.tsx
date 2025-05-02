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

    console.log("로그인 시도 - 이메일:", email, "비밀번호:", password);

    if (!email) {
      setErrorMessage("아이디(이메일)를 입력해주세요");
      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력해주세요");
      return;
    }

    try {
      console.log("로그인 요청 전 - URL:", "/admin/login", "데이터:", {
        email,
        password,
      });
      const response = await api.post("/admin/login", {
        email,
        password,
      });
      console.log(
        "로그인 요청 후 - 응답 상태:",
        response.status,
        "응답 데이터:",
        response.data
      );

      // 성공적으로 로그인한 경우 대시보드로 이동
      if (response.status === 200 || response.status === 201) {
        setErrorMessage("");
        sessionStorage.setItem("isAdminLoggedIn", "true");

        // ✅ 응답 데이터 확인 및 상태 관리
        console.log("로그인 성공 응답:", response.data);

        router.push("/dashboard");
      } else {
        setErrorMessage("아이디 또는 비밀번호를 확인해주세요");
      }
    } catch (error: any) {
      setErrorMessage(`서버 오류가 발생했습니다: ${error.message}`);
      console.error("로그인 요청 오류:", error);
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
