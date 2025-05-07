import styled from "styled-components";

export const HeaderStyled = styled.div`
  &.headerOff {
    display: none;
  }
  color: white;
  background: rgb(83, 183, 232, 0.6);
  padding: 20px;
  height: 64px;
  .right {
    cursor: pointer;
    font-size: 18px;
  }
  .navigation {
    font-size: 1.25rem;
    justify-content: space-between;
    align-items: center;
    display: flex;
    grid-gap: 0.75rem;
    .userDiv {
      grid-gap: 0.75rem;
      display: flex;
    }
  }
`;
