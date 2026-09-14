import styled from "styled-components";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding-bottom: 1.8rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-grey-200);
  width: 100%;
`;

const IconBadge = styled.div`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: var(--border-radius-md);
  background: var(--color-brand-50);
  color: var(--color-brand-600);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--color-brand-200);

  svg {
    width: 2.2rem;
    height: 2.2rem;
  }
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-grey-800);
  margin: 0;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  margin: 0;
  line-height: 1.4;
`;

function FormHeader({ icon, title, subtitle, badge }) {
  return (
    <HeaderContainer>
      {icon && <IconBadge>{icon}</IconBadge>}
      <HeaderText>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Title>{title}</Title>
          {badge}
        </div>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </HeaderText>
    </HeaderContainer>
  );
}

export default FormHeader;
