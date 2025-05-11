// styled.ts
import styled from "styled-components";

export const MemberEditStyled = styled.div`
  &.edit-wrap {
    padding: 24px;

    h2 {
      margin-bottom: 20px;
    }

    .info-text {
      margin-bottom: 8px;
    }

    .edit-box {
      margin: 10px 0 15px 0;

      label {
        display: block;
        margin-bottom: 4px;
      }

      .ant-input,
      .ant-select {
        width: 100%;
        margin-top: 3px;
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
