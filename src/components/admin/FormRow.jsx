import styled, { css } from "styled-components";

const StyledFormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.4rem 0;
  width: 100%;

  ${(props) =>
    props.orientation === "horizontal" &&
    css`
      display: grid;
      grid-template-columns: 20rem 1fr;
      align-items: center;
      gap: 1.6rem;
    `}

  /* Special treatment if the row contains submit/cancel buttons */
  &:has(button) {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 1.2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-grey-200);
    margin-top: 1.2rem;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.cols || 2}, 1fr);
  gap: 1.6rem;
  width: 100%;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1.35rem;
  color: var(--color-grey-700);
  display: flex;
  align-items: center;
  gap: 0.4rem;

  .required {
    color: #ef4444;
    margin-left: 2px;
  }
`;

const Error = styled.span`
  font-size: 1.2rem;
  color: #ef4444;
  font-weight: 500;
`;

function FormRow({ label, error, required, children, orientation }) {
  const childId = children?.props?.id || undefined;
  return (
    <StyledFormRow orientation={orientation}>
      {label && (
        <Label htmlFor={childId}>
          {label}
          {required && <span className="required">*</span>}
        </Label>
      )}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
