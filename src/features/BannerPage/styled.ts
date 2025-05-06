import styled from "styled-components";

export const BannerPageStyled = styled.div`
  &.banner-wrap {
    padding: 24px;

    .banner-box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .banner-img {
      width: 150px;
      height: 80px;
      object-fit: cover;
    }
    .banner-row {
      cursor: pointer;
    }
  }
`;
