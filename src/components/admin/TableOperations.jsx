import styled from "styled-components";

const TableOperations = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: nowrap;
  width: 100%;
  padding: 1.2rem 1.6rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.2rem;
  overflow-x: auto;

  /* Custom subtle scrollbar if overflow occurs on small devices */
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: 4px;
  }
`;

export const OperationsGroup = styled.div`
  display: contents;
`;

export default TableOperations;
