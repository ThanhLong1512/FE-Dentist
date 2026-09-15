import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => (props.$isCollapsed ? "0.4rem 0" : "0.6rem 1rem")};

  img {
    height: ${(props) => (props.$isCollapsed ? "34px" : "48px")};
    max-width: ${(props) => (props.$isCollapsed ? "34px" : "180px")};
    object-fit: contain;
    transition: all 0.3s ease;
  }
`;

function Logo({ isCollapsed = false }) {
  return (
    <StyledLogo $isCollapsed={isCollapsed}>
      <img src="/logo.png" alt="Nha Khoa Cheese" />
    </StyledLogo>
  );
}

export default Logo;
