import styled from "styled-components";

export const BannerDetailStyled = styled.div`
  &.banner-detail-wrap {
    padding: 24px;

    .detail-head {
      display: flex;
      justify-content: space-between;
    }

    .detail-box {
      margin-left: -24px;

      .ant-card {
        border: none;
      }
      .ant-descriptions {
        width: calc(100% + 24px);
      }
    }

    .detail-image {
      width: 100%;
      max-width: 700px;
      height: 300px;
      border: 1px solid #eee;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin: 8px 0;
    }
  }
`;
