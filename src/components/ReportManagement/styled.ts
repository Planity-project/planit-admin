import styled from "styled-components";

export const ReportManageStyled = styled.div`
  &.report-wrap {
    padding: 24px;
    .report-head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;

      .report-active-btn {
        display: flex;
        gap: 10px;
      }
    }

    .manage-info {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: 10px;
      margin-bottom: 10px;
    }

    .ant-table-cell-row-hover {
      cursor: pointer;
    }
  }
`;
