import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  ShieldCheck,
  Award,
  Sparkles,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLanguage } from "../context/LanguageContext";
import CheeseLogo from "./CheeseLogo";

const FooterWrapper = styled.footer`
  background: ${(props) => (props.$isDark ? "#090d16" : "#0f172a")};
  color: #94a3b8;
  padding-top: 5rem;
  border-top: 1px solid
    ${(props) => (props.$isDark ? "#1e293b" : "#1e293b")};
`;

const ReassuranceRow = styled.div`
  max-width: 1280px;
  margin: 0 auto 5rem;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2.4rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  padding-bottom: 4rem;

  .item {
    display: flex;
    align-items: center;
    gap: 1.4rem;

    .icon-box {
      width: 5rem;
      height: 5rem;
      border-radius: 1.2rem;
      background: rgba(14, 165, 233, 0.12);
      color: #38bdf8;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .text {
      h4 {
        color: #ffffff;
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 0.3rem;
      }
      p {
        font-size: 1.3rem;
        margin: 0;
        color: #94a3b8;
      }
    }
  }
`;

const MainFooterGrid = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem 5rem;
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.4fr 1.4fr;
  gap: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  h3 {
    color: #ffffff;
    font-size: 1.7rem;
    font-weight: 700;
    margin: 0;
    position: relative;
    padding-bottom: 1rem;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 3.5rem;
      height: 3px;
      background: linear-gradient(90deg, #0ea5e9, #2563eb);
      border-radius: 999px;
    }
  }

  p {
    font-size: 1.4rem;
    line-height: 1.7;
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    li a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 1.4rem;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.6rem;

      &:hover {
        color: #38bdf8;
        transform: translateX(4px);
      }
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  font-size: 1.4rem;
  line-height: 1.6;

  svg {
    color: #38bdf8;
    flex-shrink: 0;
    margin-top: 0.3rem;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 1.2rem 1.4rem;
    border-radius: 0.8rem;
    border: 1px solid rgba(148, 163, 184, 0.2);
    background: rgba(30, 41, 59, 0.5);
    color: #ffffff;
    font-size: 1.35rem;

    &:focus {
      outline: none;
      border-color: #38bdf8;
    }
  }

  button {
    padding: 1.2rem 1.6rem;
    border-radius: 0.8rem;
    border: none;
    background: linear-gradient(135deg, #0ea5e9, #2563eb);
    color: white;
    font-weight: 700;
    font-size: 1.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    transition: all 0.2s;

    &:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  padding: 2.4rem 2rem;
  background: rgba(0, 0, 0, 0.2);

  .container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 1.3rem;

    .links {
      display: flex;
      gap: 2rem;

      a {
        color: #64748b;
        text-decoration: none;
        &:hover {
          color: #94a3b8;
        }
      }
    }
  }
`;

export default function ModernFooter() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  return (
    <FooterWrapper $isDark={isDarkMode}>
      {/* Cam kết chất lượng dịch vụ */}
      <ReassuranceRow>
        <div className="item">
          <div className="icon-box">
            <Award size={26} />
          </div>
          <div className="text">
            <h4>{t("footer.reassurance.item1Title")}</h4>
            <p>{t("footer.reassurance.item1Desc")}</p>
          </div>
        </div>

        <div className="item">
          <div className="icon-box">
            <ShieldCheck size={26} />
          </div>
          <div className="text">
            <h4>{t("footer.reassurance.item2Title")}</h4>
            <p>{t("footer.reassurance.item2Desc")}</p>
          </div>
        </div>

        <div className="item">
          <div className="icon-box">
            <Sparkles size={26} />
          </div>
          <div className="text">
            <h4>{t("footer.reassurance.item3Title")}</h4>
            <p>{t("footer.reassurance.item3Desc")}</p>
          </div>
        </div>

        <div className="item">
          <div className="icon-box">
            <CreditCard size={26} />
          </div>
          <div className="text">
            <h4>{t("footer.reassurance.item4Title")}</h4>
            <p>{t("footer.reassurance.item4Desc")}</p>
          </div>
        </div>
      </ReassuranceRow>

      {/* Thông tin chính */}
      <MainFooterGrid>
        <Col>
          <CheeseLogo size="md" isDark={true} />
          <p>{t("footer.aboutDesc")}</p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.8rem" }}>
            <span
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "0.6rem",
                background: "rgba(14, 165, 233, 0.15)",
                color: "#38bdf8",
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              {t("footer.license")}
            </span>
          </div>
        </Col>

        <Col>
          <h3>{t("footer.featuredServices")}</h3>
          <ul>
            <li>
              <Link to="/shop">{t("home.servicesTag", "Dịch Vụ")}</Link>
            </li>
            <li>
              <Link to="/booking">{t("nav.bookNow", "Đặt Hẹn")}</Link>
            </li>
            <li>
              <Link to="/facilities">{t("nav.facilities", "Hệ Thống Cơ Sở")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("nav.contact", "Liên Hệ Bác Sĩ")}</Link>
            </li>
          </ul>
        </Col>

        <Col>
          <h3>{t("footer.contactInfo")}</h3>
          <ContactItem>
            <MapPin size={20} />
            <span>{t("footer.branch1")}</span>
          </ContactItem>
          <ContactItem>
            <MapPin size={20} />
            <span>{t("footer.branch2")}</span>
          </ContactItem>
          <ContactItem>
            <Phone size={20} />
            <span>{t("footer.hotline")}</span>
          </ContactItem>
          <ContactItem>
            <Mail size={20} />
            <span>{t("footer.email")}</span>
          </ContactItem>
          <ContactItem>
            <Clock size={20} />
            <span>{t("footer.workingHours")}</span>
          </ContactItem>
        </Col>

        <Col>
          <h3>{t("footer.newsletterTitle")}</h3>
          <p>{t("footer.newsletterDesc")}</p>
          <NewsletterForm
            onSubmit={(e) => {
              e.preventDefault();
              alert("Cảm ơn bạn đã đăng ký!");
            }}
          >
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              required
            />
            <button type="submit">
              <span>{t("footer.subscribeBtn")}</span>
              <ArrowRight size={16} />
            </button>
          </NewsletterForm>
        </Col>
      </MainFooterGrid>

      <BottomBar>
        <div className="container">
          <div>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </div>
          <div className="links">
            <Link to="/privacy">{t("footer.privacy")}</Link>
            <Link to="/terms">{t("footer.terms")}</Link>
            <Link to="/booking">{t("footer.booking")}</Link>
          </div>
        </div>
      </BottomBar>
    </FooterWrapper>
  );
}
