import styled from "styled-components";

export const AlbumUserManageStyled = styled.div`
  &.manage-wrap {
    padding: 24px;
    background: #fff;
    border-radius: 8px;
  }

  .manage-title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: bold;
    }

    .manage-delete-button {
      background-color: white;
      border: none;
    }
  }

  .manage-select-box {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    .ant-select {
      min-width: 80px;
    }
  }

  .manage-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .manage-total-num {
      font-weight: 500;
    }
  }

  .stop {
    color: red;
    font-weight: bold;
  }

  .run {
    color: green;
    font-weight: bold;
  }
`;
