import styled from "styled-components";

export const MemberEditStyled = styled.div`
  &.edit-wrap {
    padding: 24px;
    width: 300px;

    .edit-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .info-text {
      margin-bottom: 8px;
      font-size: 14px;
      color: #555;
    }

    .edit-box {
      margin: 10px 0 15px 0;

      label {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
      }

      .ant-input,
      .ant-btn {
        margin-top: 3px;
      }

      .add-status {
        margin-right: 20px;
      }
    }

    .ant-btn {
      margin-top: 16px;
    }

    .error-message {
      font-size: 12px;
      color: red;
    }

    .green-text {
      color: green;
    }

    .red-text {
      color: red;
    }
  }
`;
