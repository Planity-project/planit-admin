import styled from "styled-components";

export const LoginPageStyled = styled.div`
  &.login-wrap {
    margin: 0 auto;
    padding: 0;
    width: 100%;
    .login-title {
      margin-bottom: 10px;
    }

    .login-box {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: white;
      max-width: 1280px;
      height: 370px;
      margin: 60px auto;
      border-radius: 4px;

      .login-form {
        width: 50%;

        .login-errorMessage {
          color: rgb(230, 73, 56);
          font-size: 12px;
          margin-top: 10px;
        }

        .login-btn {
          width: 100%;
          padding: 10px 34px;
          font-size: 16px;
          border-radius: 4px;
          margin-top: 2px;
          border: none;
          background-color: rgb(83, 183, 232, 0.6);
          color: white;

          &:hover {
            cursor: pointer;
          }
        }
        .login-id,
        .login-pw {
          width: 100%;
          height: 45px;

          padding: 14px 14px;
          font-size: 15px;
          margin: 3px 0;
          border: none;
          border-bottom: 1px solid rgb(214, 222, 235);

          &:focus {
            outline: none;
          }
        }
      }
    }
    .login-pw-box {
      position: relative;
    }
    .toggleBtn {
      font-size: 20px;
      position: absolute;
      top: 16px;
      right: 15px;
    }
  }
`;
