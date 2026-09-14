import styled from "styled-components";

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  color: var(--color-grey-800);
  border-radius: var(--border-radius-md);
  padding: 1.1rem 1.4rem;
  font-size: 1.4rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  width: 100%;

  &:focus {
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
  }

  &::placeholder {
    color: var(--color-grey-400);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    color: var(--color-grey-400);
    cursor: not-allowed;
  }
`;

export default Input;
