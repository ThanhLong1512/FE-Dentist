import { createContext, useContext } from "react";
import styled from "styled-components";
import { Inbox } from "lucide-react";

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-200);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-grey-500);
`;

const StyledBody = styled.section`
  margin: 0;
`;

const StyledRow = styled(CommonRow)`
  padding: 1.4rem 2.4rem;
  transition: background-color 0.15s ease, transform 0.15s ease;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.4rem 2.4rem;
  border-top: 1px solid var(--color-grey-100);

  &:not(:has(*)) {
    display: none;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 4.8rem 2.4rem;
  color: var(--color-grey-400);

  svg {
    width: 4.8rem;
    height: 4.8rem;
    color: var(--color-grey-300);
  }

  p {
    font-size: 1.5rem;
    font-weight: 500;
  }
`;

const TableContext = createContext();

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader columns={columns} role="row" as="header">
      {children}
    </StyledHeader>
  );
}

function Row({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledRow columns={columns} role="row">
      {children}
    </StyledRow>
  );
}

function Body({ data, render }) {
  if (!data || !data.length)
    return (
      <EmptyContainer>
        <Inbox />
        <p>Hiện chưa có dữ liệu hiển thị</p>
      </EmptyContainer>
    );

  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
