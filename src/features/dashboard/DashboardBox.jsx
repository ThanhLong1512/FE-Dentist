import styled from "styled-components";

const DashboardBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

export default DashboardBox;
