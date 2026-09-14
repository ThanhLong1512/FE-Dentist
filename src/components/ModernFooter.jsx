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

  return (
    <FooterWrapper $isDark={isDarkMode}>
      {/* Cam kết chất lượng dịch vụ */}
      <ReassuranceRow>
        <div className="item">
          <div className="icon-box">
            <Award size={26} />
          </div>
          <div className="text">
            <h4>Bác Sĩ Chuyên Khoa I</h4>
            <p>100% Tốt nghiệp ĐH Y Dược & Tu nghiệp nước ngoài</p>
          </div>
        </div>

        <div className="item">
          <div className="icon-box">
            <ShieldCheck size={26} />
          </div>
          <div className="text">
            <h4>Vô Trùng Chuẩn Y Tế</h4>
            <p>Quy trình vô trùng khép kín Autoclave Class B</p>
          </div>
        </div>

        <div className="item">
          <div className="icon-box">
            <Sparkles size={26} />
          </div>
          <div className="text">
            <h4>Bảo Hành Chính Hãng</h4>
            <p>Bảo hành trọn đời cho trụ Implant & răng sứ</p>
          </div>
        </div>

        <div className="item">
          <div className="icon-box">
            <CreditCard size={26} />
          </div>
          <div className="text">
            <h4>Trả Góp 0% Lãi Suất</h4>
            <p>Hỗ trợ chia đợt thanh toán cho niềng răng & implant</p>
          </div>
        </div>
      </ReassuranceRow>

      {/* Thông tin chính */}
      <MainFooterGrid>
        <Col>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
              }}
            >
              🦷
            </div>
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.03em",
              }}
            >
              DENTIST PRO
            </span>
          </div>
          <p>
            Hệ thống nha khoa kỹ thuật cao hàng đầu với sứ mệnh kiến tạo nụ cười
            tự tin, chăm sóc sức khỏe răng miệng toàn diện cho hàng chục ngàn
            gia đình Việt Nam theo tiêu chuẩn quốc tế.
          </p>
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
              Bộ Y Tế Cấp Phép #0892/SYT-GPHĐ
            </span>
          </div>
        </Col>

        <Col>
          <h3>Dịch Vụ Nổi Bật</h3>
          <ul>
            <li>
              <Link to="/shop">Trồng Răng Implant Kỹ Thuật Số</Link>
            </li>
            <li>
              <Link to="/shop">Niềng Răng Trong Suốt Invisalign</Link>
            </li>
            <li>
              <Link to="/shop">Bọc Răng Sứ Thẩm Mỹ Nano</Link>
            </li>
            <li>
              <Link to="/shop">Nhổ Răng Khôn Sóng Siêu Âm Piezotome</Link>
            </li>
            <li>
              <Link to="/shop">Điều Trị Tủy Vi Phẫu</Link>
            </li>
            <li>
              <Link to="/shop">Tẩy Trắng Răng Laser Whitening</Link>
            </li>
          </ul>
        </Col>

        <Col>
          <h3>Thông Tin Liên Hệ</h3>
          <ContactItem>
            <MapPin size={20} />
            <span>Cơ sở 1: 123 Đường Nam Kỳ Khởi Nghĩa, Quận 1, TP. Hồ Chí Minh</span>
          </ContactItem>
          <ContactItem>
            <MapPin size={20} />
            <span>Cơ sở 2: 45 Đường Hoàng Diệu, Ba Đình, TP. Hà Nội</span>
          </ContactItem>
          <ContactItem>
            <Phone size={20} />
            <span>Hotline 24/7: 1900 8888 - 028 7300 8888</span>
          </ContactItem>
          <ContactItem>
            <Mail size={20} />
            <span>contact@dentistpro.vn</span>
          </ContactItem>
          <ContactItem>
            <Clock size={20} />
            <span>T2 - T7: 8h00 - 20h00 | CN: 8h00 - 17h00</span>
          </ContactItem>
        </Col>

        <Col>
          <h3>Đăng Ký Tư Vấn</h3>
          <p>
            Nhận cẩm nang chăm sóc răng miệng định kỳ và voucher ưu đãi 20% cho
            lần khám đầu tiên.
          </p>
          <NewsletterForm onSubmit={(e) => { e.preventDefault(); alert("Cảm ơn bạn đã đăng ký nhận tư vấn!"); }}>
            <input type="email" placeholder="Nhập email của bạn..." required />
            <button type="submit">
              <span>Đăng Ký Ngay</span>
              <ArrowRight size={16} />
            </button>
          </NewsletterForm>
        </Col>
      </MainFooterGrid>

      <BottomBar>
        <div className="container">
          <div>© {new Date().getFullYear()} DENTIST PRO. Tất cả quyền được bảo lưu.</div>
          <div className="links">
            <Link to="/privacy">Chính sách bảo mật</Link>
            <Link to="/terms">Điều khoản sử dụng</Link>
            <Link to="/booking">Đặt lịch hẹn khám</Link>
          </div>
        </div>
      </BottomBar>
    </FooterWrapper>
  );
}
