import styled from "styled-components";

export const Textarea = styled.textarea`
  padding: 1rem 1.4rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  color: var(--color-grey-800);
  font-size: 1.4rem;
  font-family: inherit;
  line-height: 1.5;
  box-shadow: var(--shadow-sm);
  width: 100%;
  min-height: 9rem;
  resize: vertical;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &::placeholder {
    color: var(--color-grey-400);
  }

  &:hover:not(:disabled) {
    border-color: var(--color-grey-400);
  }

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    background-color: var(--color-grey-0);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    color: var(--color-grey-400);
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default Textarea;
