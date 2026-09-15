import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Sparkles,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Award,
  Star,
  Clock,
  Phone,
  CheckCircle2,
  HeartHandshake,
  Stethoscope,
  ChevronRight,
  Flame,
} from "lucide-react";

import { useServices } from "../features/services/useServices";
import { useEmployees } from "../features/employee/useEmployees";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLanguage } from "../context/LanguageContext";
import {
  translateService,
  translateDoctor,
  formatLocalizedPrice,
} from "../utils/dataTranslator";
import { getImageUrl, handleImageError } from "../utils/imageHelper";

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.$isDark ? "#0b1329" : "#ffffff"};
  color: ${(props) =>
    props.$isDark ? "#f8fafc" : "#1e293b"};
  overflow-x: hidden;
`;

// HERO SECTION
const HeroSection = styled.section`
  position: relative;
  padding: 8rem 2rem 10rem;
  background: ${(props) =>
    props.$isDark
      ? "radial-gradient(ellipse at 80% 20%, rgba(14, 165, 233, 0.15), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(37, 99, 235, 0.15), transparent 50%), #0f172a"
      : "radial-gradient(ellipse at 80% 20%, rgba(14, 165, 233, 0.12), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(37, 99, 235, 0.08), transparent 50%), #f8fafc"};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 5rem 1.6rem 6rem;
  }
`;

const HeroContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 5rem;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 4rem;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  @media (max-width: 960px) {
    align-items: center;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.6rem 1.6rem;
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.15);
    color: #0284c7;
    font-size: 1.35rem;
    font-weight: 700;
    align-self: flex-start;

    @media (max-width: 960px) {
      align-self: center;
    }
  }

  h1 {
    font-size: clamp(3.2rem, 5vw, 5.2rem);
    font-weight: 850;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
    margin: 0;

    span.highlight {
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  p.subtitle {
    font-size: 1.7rem;
    line-height: 1.7;
    color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
    margin: 0;
    max-width: 580px;
  }

  .cta-group {
    display: flex;
    gap: 1.6rem;
    flex-wrap: wrap;

    @media (max-width: 960px) {
      justify-content: center;
    }
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.4rem 2.8rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.35);
  transition: all 0.25s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(14, 165, 233, 0.45);
    background: linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.4rem 2.6rem;
  border-radius: 999px;
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  color: ${(props) => (props.$isDark ? "#f8fafc" : "#1e293b")};
  font-size: 1.55rem;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid
    ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: ${(props) => (props.$isDark ? "#334155" : "#f1f5f9")};
    transform: translateY(-2px);
  }
`;

const HeroVisual = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  .card-banner {
    width: 100%;
    max-width: 440px;
    border-radius: 2.4rem;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border: 4px solid ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};

    img {
      width: 100%;
      height: 480px;
      object-fit: cover;
      display: block;
    }
  }

  .floating-badge {
    position: absolute;
    bottom: -2rem;
    left: -2rem;
    background: ${(props) =>
      props.$isDark ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)"};
    backdrop-filter: blur(12px);
    border: 1px solid
      ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
    padding: 1.4rem 1.8rem;
    border-radius: 1.4rem;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

    .icon-star {
      width: 4.4rem;
      height: 4.4rem;
      border-radius: 50%;
      background: #fef3c7;
      color: #f59e0b;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .info {
      white-space: nowrap;
      h5 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 800;
        white-space: nowrap;
        color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
      }
      p {
        margin: 0;
        font-size: 1.25rem;
        white-space: nowrap;
        color: #64748b;
      }
    }

    @media (max-width: 640px) {
      left: 1rem;
      bottom: -1rem;
    }
  }
`;

// STATS ROW
const StatsSection = styled.section`
  max-width: 1280px;
  margin: -4rem auto 6rem;
  padding: 0 2rem;
  width: 100%;
  position: relative;
  z-index: 10;
`;

const StatsCard = styled.div`
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  border: 1px solid
    ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  border-radius: 1.6rem;
  padding: 3rem 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }

  .stat-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.4rem;
    position: relative;

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      right: 0;
      top: 15%;
      height: 70%;
      width: 1px;
      background: ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};

      @media (max-width: 860px) {
        display: none;
      }
    }

    .num {
      font-size: 3.2rem;
      font-weight: 850;
      letter-spacing: -0.02em;
      white-space: nowrap;
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .label {
      font-size: 1.4rem;
      font-weight: 600;
      white-space: nowrap;
      color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
    }
  }
`;

// COMMON SECTION STYLES
const SectionWrapper = styled.section`
  padding: 6rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
`;

const SectionHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 4.5rem;

  .tag {
    font-size: 1.3rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0284c7;
    background: rgba(14, 165, 233, 0.1);
    padding: 0.4rem 1.4rem;
    border-radius: 999px;
  }

  h2 {
    font-size: clamp(2.6rem, 3.5vw, 3.8rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
    margin: 0;
  }

  p {
    font-size: 1.6rem;
    color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
    max-width: 600px;
    margin: 0;
    line-height: 1.6;
  }
`;

// FEATURES / PILLARS
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.4rem;
`;

const FeatureCard = styled.div`
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  border: 1px solid
    ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  border-radius: 1.6rem;
  padding: 2.8rem 2.4rem;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    border-color: #0284c7;
  }

  .icon-wrap {
    width: 5.6rem;
    height: 5.6rem;
    border-radius: 1.4rem;
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(37, 99, 235, 0.15));
    color: #0284c7;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
  }

  p {
    font-size: 1.4rem;
    line-height: 1.6;
    color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
    margin: 0;
  }
`;

// SERVICES SHOWCASE
const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2.8rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  border: 1px solid
    ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  border-radius: 1.8rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
    border-color: #0284c7;

    h4 {
      color: #0284c7;
    }
  }

  .img-holder {
    height: 200px;
    width: 100%;
    overflow: hidden;
    position: relative;
    background: ${(props) => (props.$isDark ? "#0f172a" : "#e2e8f0")};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    .duration-tag {
      position: absolute;
      top: 1.2rem;
      right: 1.2rem;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      color: #ffffff;
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-size: 1.15rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
  }

  .card-body {
    padding: 2.2rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    flex: 1;

    h4 {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0;
      color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
      transition: color 0.2s ease;
    }

    p.summary {
      font-size: 1.35rem;
      line-height: 1.6;
      color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
      margin: 0;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid
        ${(props) => (props.$isDark ? "#334155" : "#f1f5f9")};
      padding-top: 1.4rem;
      margin-top: auto;

      .price {
        font-size: 1.9rem;
        font-weight: 800;
        color: #0284c7;
      }
    }
  }
`;

// DOCTOR TEAM
const DoctorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.4rem;
`;

const DoctorCard = styled.div`
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  border: 1px solid
    ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  border-radius: 1.6rem;
  overflow: hidden;
  text-align: center;
  transition: all 0.25s ease;
  padding-bottom: 2rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.07);
  }

  .doc-avatar {
    width: 100%;
    height: 240px;
    object-fit: cover;
    background: ${(props) => (props.$isDark ? "#0f172a" : "#e2e8f0")};
  }

  .doc-info {
    padding: 1.8rem 1.6rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    h4 {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0;
      color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
    }

    span.exp {
      font-size: 1.3rem;
      font-weight: 600;
      color: #0284c7;
    }

    p.bio {
      font-size: 1.3rem;
      color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
      margin: 0;
    }
  }
`;

// CTA BANNER
const CTABanner = styled.div`
  background: linear-gradient(135deg, #0284c7 0%, #1e40af 100%);
  color: white;
  border-radius: 2.4rem;
  padding: 5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  margin: 4rem 0;
  box-shadow: 0 20px 40px rgba(2, 132, 199, 0.25);

  @media (max-width: 860px) {
    flex-direction: column;
    text-align: center;
    padding: 4rem 2rem;
  }

  .content {
    h2 {
      font-size: 3.2rem;
      font-weight: 850;
      margin: 0 0 1rem;
    }
    p {
      font-size: 1.6rem;
      margin: 0;
      opacity: 0.9;
      max-width: 600px;
    }
  }

  a.btn-white {
    padding: 1.5rem 3rem;
    border-radius: 999px;
    background: #ffffff;
    color: #0284c7;
    font-size: 1.6rem;
    font-weight: 800;
    text-decoration: none;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    transition: all 0.2s;

    &:hover {
      transform: scale(1.04);
      background: #f8fafc;
    }
  }
`;

export default function Home() {
  const { isDarkMode } = useDarkMode();
  const { language, t } = useLanguage();
  const { services = [] } = useServices();
  const { employees = [] } = useEmployees();
  const navigate = useNavigate();

  const fallbackServices = [
    {
      _id: "1",
      nameService: "Trồng Răng Implant Toàn Hàm All-on-4",
      summary: "Phục hồi răng mất trọn đời bằng trụ Titanium cao cấp nhập khẩu Thụy Sĩ, ăn nhai như răng thật.",
      durationMinutes: 45,
      priceService: 15000000,
    },
    {
      _id: "2",
      nameService: "Niềng Răng Trong Suốt Invisalign Hoa Kỳ",
      summary: "Chỉnh nha vô hình công nghệ Mỹ, tính thẩm mỹ cao, tháo lắp linh hoạt, không đau đớn.",
      durationMinutes: 30,
      priceService: 45000000,
    },
    {
      _id: "3",
      nameService: "Bọc Răng Sứ Thẩm Mỹ Nano",
      summary: "Khắc phục răng ố vàng, sứt mẻ, tạo dáng nụ cười chuẩn tỷ lệ vàng chỉ sau 2 lần hẹn.",
      durationMinutes: 60,
      priceService: 3500000,
    },
    {
      _id: "4",
      nameService: "Nhổ Răng Khôn Sóng Siêu Âm Piezotome",
      summary: "Kỹ thuật nhổ răng không xâm lấn, lành thương nhanh chóng, hạn chế tối đa cảm giác đau nhức.",
      durationMinutes: 20,
      priceService: 1200000,
    },
    {
      _id: "5",
      nameService: "Tẩy Trắng Răng Laser Whitening",
      summary: "Bật tông trắng sáng chỉ sau 45 phút điều trị bằng công nghệ ánh sáng Laser an toàn cho men răng.",
      durationMinutes: 45,
      priceService: 1800000,
    },
    {
      _id: "6",
      nameService: "Điều Trị Tủy Vi Phẫu Không Đau",
      summary: "Làm sạch ống tủy triệt để dưới kính hiển vi chuyên dụng, chấm dứt cơn đau nhức răng cấp tính.",
      durationMinutes: 40,
      priceService: 1500000,
    },
  ];

  const rawServicesList = services.length > 0 ? services.slice(0, 6) : fallbackServices;
  const displayedServices = rawServicesList.map((s) => translateService(s, language));

  const fallbackDoctors = [
    {
      _id: "doc1",
      name: "BS. CKI Nguyễn Văn Minh",
      experience: "15 năm kinh nghiệm",
      description: "Chuyên gia cấy ghép Implant & Phục hình sứ",
    },
    {
      _id: "doc2",
      name: "ThS. BS Trần Thị Mai",
      experience: "12 năm kinh nghiệm",
      description: "Chuyên gia Chỉnh nha & Niềng răng Invisalign",
    },
    {
      _id: "doc3",
      name: "BS. CKI Lê Quang Huy",
      experience: "10 năm kinh nghiệm",
      description: "Chuyên gia Tiểu phẫu & Nhổ răng khôn Piezotome",
    },
    {
      _id: "doc4",
      name: "BS. Hoàng Bảo Ngọc",
      experience: "8 năm kinh nghiệm",
      description: "Chuyên gia Nha khoa Thẩm mỹ & Tẩy trắng răng",
    },
  ];

  const rawDoctorsList = employees.length > 0 ? employees.slice(0, 4) : fallbackDoctors;
  const displayedDoctors = rawDoctorsList.map((d) => translateDoctor(d, language));

  return (
    <HomeWrapper $isDark={isDarkMode}>
      {/* 1. HERO SECTION */}
      <HeroSection $isDark={isDarkMode}>
        <HeroContainer>
          <HeroContent $isDark={isDarkMode}>
            <div className="badge">
              <Sparkles size={16} /> {t("home.badge")}
            </div>
            <h1>
              {t("home.heroTitle1")} <br />
              <span className="highlight">{t("home.heroHighlight")}</span> {t("home.heroTitle2")}
            </h1>
            <p className="subtitle">
              {t("home.heroSubtitle")}
            </p>
            <div className="cta-group">
              <PrimaryButton to="/booking">
                <Calendar size={18} />
                <span>{t("home.bookFast")}</span>
              </PrimaryButton>
              <SecondaryButton to="/shop" $isDark={isDarkMode}>
                <span>{t("home.viewPrice")}</span>
                <ArrowRight size={16} />
              </SecondaryButton>
            </div>
          </HeroContent>

          <HeroVisual $isDark={isDarkMode}>
            <div className="card-banner">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                alt="Modern Dental Clinic"
              />
            </div>
            <div className="floating-badge">
              <div className="icon-star">
                <Star size={24} fill="#f59e0b" />
              </div>
              <div className="info">
                <h5>4.9 / 5.0</h5>
                <p>{t("home.reviewCount")}</p>
              </div>
            </div>
          </HeroVisual>
        </HeroContainer>
      </HeroSection>

      {/* 2. STATS BAR */}
      <StatsSection>
        <StatsCard $isDark={isDarkMode}>
          <div className="stat-col">
            <span className="num">{t("home.stats.s1Num")}</span>
            <span className="label">{t("home.stats.s1Label")}</span>
          </div>
          <div className="stat-col">
            <span className="num">{t("home.stats.s2Num")}</span>
            <span className="label">{t("home.stats.s2Label")}</span>
          </div>
          <div className="stat-col">
            <span className="num">{t("home.stats.s3Num")}</span>
            <span className="label">{t("home.stats.s3Label")}</span>
          </div>
          <div className="stat-col">
            <span className="num">{t("home.stats.s4Num")}</span>
            <span className="label">{t("home.stats.s4Label")}</span>
          </div>
        </StatsCard>
      </StatsSection>

      {/* 3. TẠI SAO CHỌN DENTIST PRO */}
      <SectionWrapper>
        <SectionHeader $isDark={isDarkMode}>
          <span className="tag">{t("home.whyChooseTag")}</span>
          <h2>{t("home.whyChooseTitle")}</h2>
          <p>{t("home.whyChooseDesc")}</p>
        </SectionHeader>

        <FeaturesGrid>
          <FeatureCard $isDark={isDarkMode}>
            <div className="icon-wrap">
              <Stethoscope size={28} />
            </div>
            <h3>{t("home.features.f1Title")}</h3>
            <p>{t("home.features.f1Desc")}</p>
          </FeatureCard>

          <FeatureCard $isDark={isDarkMode}>
            <div className="icon-wrap">
              <ShieldCheck size={28} />
            </div>
            <h3>{t("home.features.f2Title")}</h3>
            <p>{t("home.features.f2Desc")}</p>
          </FeatureCard>

          <FeatureCard $isDark={isDarkMode}>
            <div className="icon-wrap">
              <Award size={28} />
            </div>
            <h3>{t("home.features.f3Title")}</h3>
            <p>{t("home.features.f3Desc")}</p>
          </FeatureCard>

          <FeatureCard $isDark={isDarkMode}>
            <div className="icon-wrap">
              <HeartHandshake size={28} />
            </div>
            <h3>{t("home.features.f4Title")}</h3>
            <p>{t("home.features.f4Desc")}</p>
          </FeatureCard>
        </FeaturesGrid>
      </SectionWrapper>

      {/* 4. DỊCH VỤ NỔI BẬT */}
      <SectionWrapper>
        <SectionHeader $isDark={isDarkMode}>
          <span className="tag">{t("home.servicesTag")}</span>
          <h2>{t("home.servicesTitle")}</h2>
          <p>{t("home.servicesDesc")}</p>
        </SectionHeader>

        <ServicesGrid>
          {displayedServices.map((svc) => (
            <ServiceCard
              key={svc._id}
              $isDark={isDarkMode}
              onClick={() => navigate(`/shop/${svc._id}`)}
            >
              <div className="img-holder">
                <img
                  src={getImageUrl(
                    svc.photoService,
                    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
                  )}
                  alt={svc.nameService}
                  onError={(e) =>
                    handleImageError(
                      e,
                      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
                    )
                  }
                />
                <div className="duration-tag">
                  <Clock size={12} />
                  <span>
                    {svc.durationMinutes || 30} {t("home.durationMinutes")}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <h4
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/shop/${svc._id}`);
                  }}
                >
                  {svc.nameService}
                </h4>
                <p className="summary">{svc.summary || svc.description}</p>

                <div className="price-row">
                  <div className="price">
                    {formatLocalizedPrice(
                      svc.priceDiscount || svc.priceService || 0,
                      language
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                    <SecondaryButton
                      to={`/shop/${svc._id}`}
                      $isDark={isDarkMode}
                      onClick={(e) => e.stopPropagation()}
                      style={{ padding: "0.8rem 1.4rem", fontSize: "1.25rem", borderRadius: "999px" }}
                    >
                      <span>{t("home.viewDetail")}</span>
                    </SecondaryButton>
                    <PrimaryButton
                      to={`/booking?serviceId=${svc._id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ padding: "0.8rem 1.6rem", fontSize: "1.3rem" }}
                    >
                      <span>{t("home.bookNow")}</span>
                      <ChevronRight size={14} />
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </ServiceCard>
          ))}
        </ServicesGrid>

        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <SecondaryButton to="/shop" $isDark={isDarkMode}>
            <span>{t("home.viewAllServices")}</span>
            <ArrowRight size={18} />
          </SecondaryButton>
        </div>
      </SectionWrapper>

      {/* 5. ĐỘI NGŨ BÁC SĨ */}
      <SectionWrapper id="doctors">
        <SectionHeader $isDark={isDarkMode}>
          <span className="tag">{t("home.doctorsTag")}</span>
          <h2>{t("home.doctorsTitle")}</h2>
          <p>{t("home.doctorsDesc")}</p>
        </SectionHeader>

        <DoctorsGrid>
          {displayedDoctors.map((doc, idx) => (
            <DoctorCard key={doc._id} $isDark={isDarkMode}>
              <img
                src={
                  doc.photo ||
                  [
                    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80",
                    "https://images.unsplash.com/photo-1594824813515-5334c93540eb?auto=format&fit=crop&w=500&q=80",
                    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80",
                    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80",
                  ][idx % 4]
                }
                alt={doc.name}
                className="doc-avatar"
              />
              <div className="doc-info">
                <h4>{doc.name}</h4>
                <span className="exp">{doc.experience}</span>
                <p className="bio">{doc.description}</p>
                <div style={{ marginTop: "1rem" }}>
                  <Link
                    to="/booking"
                    style={{
                      color: "#0284c7",
                      fontWeight: 700,
                      fontSize: "1.3rem",
                      textDecoration: "none",
                    }}
                  >
                    {t("home.bookDoctor")} →
                  </Link>
                </div>
              </div>
            </DoctorCard>
          ))}
        </DoctorsGrid>
      </SectionWrapper>

      {/* 6. CTA BANNER CUỐI TRANG */}
      <SectionWrapper>
        <CTABanner>
          <div className="content">
            <h2>{t("home.ctaTitle")}</h2>
            <p>{t("home.ctaDesc")}</p>
          </div>
          <Link to="/booking" className="btn-white">
            {t("home.ctaBtn")}
          </Link>
        </CTABanner>
      </SectionWrapper>
    </HomeWrapper>
  );
}
