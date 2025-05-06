import styled from "styled-components";

export const UserManageStyled = styled.div`
  &.manage-wrap {
    padding: 24px;
    .manage-title-box {
      display: flex;
      justify-content: space-between;
    }

    .manage-select-box {
      .ant-select-selector {
        margin-right: 5px;
      }
    }
    .manage-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      .manage-total-num {
        font-weight: 600;
        margin: 15px 0 2px 5px;
      }
    }
    .manage-delete-button {
      margin-left: 3px;
    }
  }
`;
