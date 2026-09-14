import styled, { css } from "styled-components";

const Form = styled.form`
  ${(props) =>
    props.type !== "regular" &&
    css`
      padding: 0.8rem 0;
      background-color: transparent;
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 76rem;
      max-width: 100%;
    `}
    
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

Form.defaultProps = {
  type: "regular",
};

export default Form;
