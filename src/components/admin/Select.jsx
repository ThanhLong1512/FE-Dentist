import React, { forwardRef } from "react";
import styled from "styled-components";

export const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 1rem 3.6rem 1rem 1.4rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  color: var(--color-grey-800);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  width: 100%;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1.2rem center;
  background-size: 1.6rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(:disabled) {
    border-color: var(--color-grey-400);
  }

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    color: var(--color-grey-400);
    cursor: not-allowed;
    opacity: 0.7;
  }

  option {
    background-color: var(--color-grey-0);
    color: var(--color-grey-800);
    padding: 0.8rem;
  }
`;

const Select = forwardRef(function Select(
  { options, value, onChange, children, ...props },
  ref
) {
  return (
    <StyledSelect ref={ref} value={value} onChange={onChange} {...props}>
      {children
        ? children
        : options?.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
    </StyledSelect>
  );
});

export default Select;
