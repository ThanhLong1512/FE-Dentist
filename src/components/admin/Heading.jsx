import styled, { css } from "styled-components";

// const test = css`
//   text-align: center;
//   ${10 > 5 && "background-color: yellow"}
// `;

const Heading = styled.h1`
  color: var(--color-grey-800);
  letter-spacing: -0.5px;

  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 2.6rem;
      font-weight: 700;
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
    
    ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 1.8rem;
      font-weight: 600;
    `}
    
  line-height: 1.3;
`;

export default Heading;
