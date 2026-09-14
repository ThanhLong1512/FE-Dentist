import styled from "styled-components";
import { TrendingUp, Award } from "lucide-react";

const StyledStat = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  padding: 2.2rem 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3.5px;
    background: ${(props) => props.$gradient || "var(--color-brand-gradient)"};
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-brand-300);

    &::before {
      opacity: 1;
      height: 4.5px;
    }
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  width: 5.2rem;
  height: 5.2rem;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) => props.$bg || "var(--color-brand-50)"};
  color: ${(props) => props.$color || "var(--color-brand-600)"};
  box-shadow: 0 4px 12px ${(props) => props.$shadow || "rgba(2, 132, 199, 0.15)"};
  transition: transform 0.25s ease;

  ${StyledStat}:hover & {
    transform: scale(1.08) rotate(3deg);
  }

  & svg {
    width: 2.6rem;
    height: 2.6rem;
  }
`;

const TrendBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 1.15rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: var(--border-radius-full);
  background: ${(props) =>
    props.$type === "growth"
      ? "rgba(16, 185, 129, 0.12)"
      : props.$type === "rating"
      ? "rgba(245, 158, 11, 0.12)"
      : "var(--color-grey-100)"};
  color: ${(props) =>
    props.$type === "growth"
      ? "#10b981"
      : props.$type === "rating"
      ? "#f59e0b"
      : "var(--color-grey-600)"};
`;

const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
`;

const Title = styled.h5`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-400);
  margin: 0;
`;

const Value = styled.p`
  font-size: 2.6rem;
  line-height: 1.1;
  font-weight: 800;
  color: var(--color-grey-800);
  letter-spacing: -0.6px;
  margin: 0;
`;

const Sublabel = styled.span`
  font-size: 1.15rem;
  color: var(--color-grey-400);
  margin-top: 0.2rem;
`;

function Stat({
  icon,
  title,
  value,
  badgeText,
  badgeType = "growth",
  sublabel,
  bg,
  color,
  gradient,
  shadow,
}) {
  return (
    <StyledStat $gradient={gradient}>
      <TopRow>
        <IconWrapper $bg={bg} $color={color} $shadow={shadow}>
          {icon}
        </IconWrapper>
        {badgeText && (
          <TrendBadge $type={badgeType}>
            {badgeType === "growth" && <TrendingUp size={12} />}
            {badgeType === "rating" && <Award size={12} />}
            <span>{badgeText}</span>
          </TrendBadge>
        )}
      </TopRow>

      <BottomContent>
        <Title>{title}</Title>
        <Value>{value}</Value>
        {sublabel && <Sublabel>{sublabel}</Sublabel>}
      </BottomContent>
    </StyledStat>
  );
}

export default Stat;
