import { useDarkMode } from "../hooks/useDarkMode";
import { useLanguage } from "../context/LanguageContext";
import FacilityMap from "../components/map/FacilityMap";
import { Sparkles, ShieldCheck, Award, PhoneCall } from "lucide-react";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${(props) => (props.$isDark ? "#090d16" : "#f8fafc")};
  color: ${(props) => (props.$isDark ? "#f8fafc" : "#0f172a")};
  padding: 4rem 1.6rem 6rem;
  transition: background-color 0.3s ease;
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;

const HeroBanner = styled.div`
  text-align: center;
  margin-bottom: 3.6rem;
  padding: 3.2rem 2rem;
  border-radius: 2.4rem;
  background: ${(props) =>
    props.$isDark
      ? "linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(30, 41, 59, 0.7) 100%)"
      : "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)"};
  border: 1px solid
    ${(props) =>
      props.$isDark ? "rgba(56, 189, 248, 0.2)" : "rgba(186, 230, 253, 0.8)"};

  .badge-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 1.4rem;
    border-radius: 999px;
    background: ${(props) =>
      props.$isDark ? "rgba(56, 189, 248, 0.18)" : "#ffffff"};
    color: #0284c7;
    font-size: 1.3rem;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 1.6rem;
  }

  h1 {
    font-size: 3.2rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: ${(props) => (props.$isDark ? "#f8fafc" : "#0f172a")};
    margin: 0 0 1.2rem;
  }

  p {
    max-width: 680px;
    margin: 0 auto;
    font-size: 1.55rem;
    line-height: 1.6;
    color: ${(props) => (props.$isDark ? "#94a3b8" : "#475569")};
  }

  @media (max-width: 640px) {
    padding: 2.4rem 1.6rem;
    h1 {
      font-size: 2.4rem;
    }
    p {
      font-size: 1.35rem;
    }
  }
`;

const FeatureRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3.6rem;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.8rem 2rem;
  border-radius: 1.6rem;
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  border: 1px solid ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  .icon-wrap {
    width: 4.8rem;
    height: 4.8rem;
    border-radius: 1.2rem;
    background: ${(props) =>
      props.$isDark ? "rgba(56, 189, 248, 0.15)" : "#e0f2fe"};
    color: #0284c7;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .content {
    h4 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.3rem;
      color: ${(props) => (props.$isDark ? "#f8fafc" : "#0f172a")};
    }
    p {
      font-size: 1.25rem;
      color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
      margin: 0;
    }
  }
`;

export default function Facilities() {
  const { isDarkMode } = useDarkMode();
  const { t, language } = useLanguage();

  return (
    <PageWrapper $isDark={isDarkMode}>
      <Container>
        <HeroBanner $isDark={isDarkMode}>
          <div className="badge-tag">
            <Sparkles size={16} />
            <span>{t("facilities.badge")}</span>
          </div>
          <h1>{t("facilities.title")}</h1>
          <p>
            {t("facilities.subtitle")}
          </p>
        </HeroBanner>

        <FeatureRow>
          <FeatureCard $isDark={isDarkMode}>
            <div className="icon-wrap">
              <Award size={24} />
            </div>
            <div className="content">
              <h4>
                {language === "en"
                  ? "100% Prime City Locations"
                  : language === "zh"
                  ? "100% 核心商圈黄金地标"
                  : "100% Vị Trí Trung Tâm"}
              </h4>
              <p>
                {language === "en"
                  ? "Direct frontage on major avenues, easily accessible with car parking."
                  : language === "zh"
                  ? "临街主干道黄金口岸，配备专属地面及地下充裕车位。"
                  : "Mặt tiền đường lớn, thuận tiện di chuyển và có chỗ đỗ ô tô."}
              </p>
            </div>
          </FeatureCard>

          <FeatureCard $isDark={isDarkMode}>
            <div className="icon-wrap">
              <ShieldCheck size={24} />
            </div>
            <div className="content">
              <h4>
                {language === "en"
                  ? "Sterilization Standards"
                  : language === "zh"
                  ? "欧盟医用级感控灭菌"
                  : "Phòng Vô Trùng Đạt Chuẩn"}
              </h4>
              <p>
                {language === "en"
                  ? "Closed-loop German Melag sterilization system, absolutely safe."
                  : language === "zh"
                  ? "德国Melag全闭环单向无菌层流系统，杜绝交叉感染。"
                  : "Hệ thống khử khuẩn Melag (Đức) khép kín, an toàn tuyệt đối."}
              </p>
            </div>
          </FeatureCard>

          <FeatureCard $isDark={isDarkMode}>
            <div className="icon-wrap">
              <PhoneCall size={24} />
            </div>
            <div className="content">
              <h4>
                {language === "en"
                  ? "24/7 Priority Hotline"
                  : language === "zh"
                  ? "24/7 专属紧急健康热线"
                  : "Hotline Hỗ Trợ 24/7"}
              </h4>
              <p>
                {language === "en"
                  ? "Round-the-clock emergency assistance and automated reminders."
                  : language === "zh"
                  ? "全天候急诊统筹响应、双语导医与智能复诊提醒服务。"
                  : "Tổng đài tư vấn, điều phối ca cấp cứu và nhắc hẹn thông minh."}
              </p>
            </div>
          </FeatureCard>
        </FeatureRow>

        {/* The Interactive Map Component */}
        <FacilityMap />
      </Container>
    </PageWrapper>
  );
}
