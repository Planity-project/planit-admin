import styled from "styled-components";

export const BannerFormStyled = styled.div`
  &.banner-wrap {
    padding: 24px;

    .form-head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .form-item {
      margin: 20px 0;
      display: flex;
      flex-direction: column;

      .form-label {
        margin-bottom: 10px;
      }

      .form-image {
        width: 100%;
        height: 416.29px;
        margin-top: 10px;
        object-fit: cover;
      }

      .form-error {
        color: red;
        font-size: 14px;
      }

      .ant-input {
        padding: 14px;
      }
    }
  }
`;
