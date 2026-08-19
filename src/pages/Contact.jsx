import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  handleGetShiftsByDayAndDate,
  handleHoldAppointment,
} from "../apis";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLanguage } from "../context/LanguageContext";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
} from "lucide-react";

const MAP_CENTER = { lat: 10.8231, lng: 106.6297 };

function Contact() {
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    appointmentDate: null,
    shift: "",
  });
  const navigate = useNavigate();
  const { t } = useLanguage();

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const fetchShifts = async () => {
      if (!formData.appointmentDate) {
        setShifts([]);
        return;
      }

      try {
        const dayOfWeek = dayNames[formData.appointmentDate.getDay()];
        const availableShifts = await handleGetShiftsByDayAndDate(
          dayOfWeek,
          formData.appointmentDate
        );
        setShifts(availableShifts || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || error?.message || "Không thể tải ca khám"
        );
      }
    };

    fetchShifts();
  }, [formData.appointmentDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShiftChange = (e) => {
    setFormData((prev) => ({ ...prev, shift: e.target.value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, appointmentDate: date, shift: "" }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
      if (!userInfo) {
        toast.error("Vui lòng đăng nhập để đặt lịch");
        navigate("/login");
        return;
      }

      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.appointmentDate ||
        !formData.shift
      ) {
        toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
        return;
      }

      const selectedShift = shifts.find((shift) => shift._id === formData.shift);
      if (!selectedShift) {
        toast.error("Ca khám không hợp lệ. Vui lòng chọn lại.");
        return;
      }

      const holdResponse = await handleHoldAppointment({
        shift: formData.shift,
        Date: formData.appointmentDate.toISOString(),
      });

      const holdData = holdResponse.data;

      toast.success("Giữ chỗ thành công! Vui lòng thanh toán trong 5 phút.");

      navigate("/appointment/checkout", {
        state: {
          reservation: {
            reservationId: holdData.reservationId,
            expiresAt: holdData.expiresAt,
            holdSeconds: holdData.holdSeconds,
            appointmentDate: formData.appointmentDate.toISOString(),
            doctorName: selectedShift.employee?.name || "Bác sĩ",
            serviceName:
              selectedShift.employee?.service?.nameService || "Khám tổng quát",
            serviceId: selectedShift.employee?.service?._id,
            totalPrice: selectedShift.employee?.service?.priceService || 0,
            shiftTime: `${selectedShift.StartTime} - ${selectedShift.EndTime}`,
          },
        },
      });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để đặt lịch");
        navigate("/login");
        return;
      }
      toast.error(
        error.response?.data?.message || "Giữ chỗ thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">{t("contact.title")}</h1>
          <p className="contact-subtitle">{t("contact.subtitle")}</p>
        </div>

        <div className="contact-layout">
          <div className="contact-form-section">
            <div className="contact-form-card">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-grid">
                  <div className="contact-field">
                    <label htmlFor="fullName">{t("contact.fullName")}</label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={t("contact.fullNamePlaceholder")}
                      required
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="email">{t("contact.email")}</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("contact.emailPlaceholder")}
                      required
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="phone">{t("contact.phone")}</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t("contact.phonePlaceholder")}
                      required
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="appointmentDate">{t("contact.dateTime")}</label>
                    <DatePicker
                      id="appointmentDate"
                      selected={formData.appointmentDate}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      placeholderText={t("contact.datePlaceholder")}
                      className="contact-datepicker"
                      required
                    />
                  </div>
                </div>

                <div className="contact-field contact-field-full">
                  <label htmlFor="shift">{t("contact.shift")}</label>
                  <select
                    id="shift"
                    name="shift"
                    value={formData.shift}
                    onChange={handleShiftChange}
                    required
                  >
                    <option value="">{t("contact.shiftPlaceholder")}</option>
                    {shifts.map((shift) => (
                      <option key={shift._id} value={shift._id}>
                        {shift.employee?.name || "Bác sĩ"} - {shift.StartTime} -{" "}
                        {shift.EndTime} (
                        {shift.employee?.service?.nameService || "Khám tổng quát"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="contact-field contact-field-full">
                  <label htmlFor="message">{t("contact.message")}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t("contact.messagePlaceholder")}
                    rows={4}
                  />
                </div>

                <button type="submit" className="contact-submit-btn">
                  <Send size={20} />
                  {t("contact.submit")}
                </button>
              </form>
            </div>
          </div>

          <aside className="contact-info-section">
            <div className="contact-info-card">
              <h3>Thông tin liên hệ</h3>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <MapPin size={22} className="contact-info-icon" />
                  <div>
                    <span className="contact-info-label">{t("contact.address")}</span>
                    <span className="contact-info-value">{t("contact.addressValue")}</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <Clock size={22} className="contact-info-icon" />
                  <div>
                    <span className="contact-info-label">{t("contact.hours")}</span>
                    <span className="contact-info-value">{t("contact.hoursValue")}</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <Phone size={22} className="contact-info-icon" />
                  <div>
                    <span className="contact-info-label">{t("contact.phoneLabel")}</span>
                    <span className="contact-info-value">+1 234 567 890</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <Mail size={22} className="contact-info-icon" />
                  <div>
                    <span className="contact-info-label">{t("contact.emailLabel")}</span>
                    <span className="contact-info-value">contact@dentist.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-map-wrap">
              <iframe
                title="Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${MAP_CENTER.lng - 0.015}%2C${MAP_CENTER.lat - 0.015}%2C${MAP_CENTER.lng + 0.015}%2C${MAP_CENTER.lat + 0.015}&layer=mapnik`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </div>

      <style>{contactStyles}</style>
    </div>
  );
}

const contactStyles = `
  .contact-page {
    padding: 32px 0 60px;
    background: #f8fafc;
    min-height: 60vh;
  }
  .contact-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .contact-header {
    text-align: center;
    margin-bottom: 40px;
  }
  .contact-title {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px;
  }
  .contact-subtitle {
    font-size: 18px;
    color: #64748b;
    margin: 0;
  }
  .contact-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 32px;
    align-items: start;
  }
  .contact-form-card {
    background: #fff;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .contact-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .contact-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .contact-field-full {
    grid-column: 1 / -1;
  }
  .contact-field label {
    font-size: 15px;
    font-weight: 600;
    color: #334155;
  }
  .contact-field input,
  .contact-field select,
  .contact-field textarea {
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 16px;
    color: #1e293b;
    transition: border-color 0.2s;
    font-family: inherit;
  }
  .contact-field input:focus,
  .contact-field select:focus,
  .contact-field textarea:focus {
    outline: none;
    border-color: #1370b5;
  }
  .contact-field input::placeholder,
  .contact-field textarea::placeholder {
    color: #94a3b8;
  }
  .contact-field select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 12 12'%3E%3Cpath fill='%23334155' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 44px;
  }
  .contact-field textarea {
    resize: vertical;
    min-height: 100px;
  }
  .contact-datepicker {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 16px;
    color: #1e293b;
    font-family: inherit;
  }
  .contact-datepicker:focus {
    outline: none;
    border-color: #1370b5;
  }
  .contact-submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px 32px;
    background: #1370b5;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .contact-submit-btn:hover {
    background: #0d5a94;
  }
  .contact-info-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .contact-info-card {
    background: #fff;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .contact-info-card h3 {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 20px;
  }
  .contact-info-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .contact-info-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  .contact-info-icon {
    color: #1370b5;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .contact-info-item div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .contact-info-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .contact-info-value {
    font-size: 15px;
    font-weight: 500;
    color: #1e293b;
    line-height: 1.5;
  }
  .contact-map-wrap {
    height: 320px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .contact-map-wrap > div {
    width: 100% !important;
    height: 100% !important;
  }
  @media (max-width: 960px) {
    .contact-layout {
      grid-template-columns: 1fr;
    }
    .contact-map-wrap {
      order: -1;
      height: 280px;
    }
  }
  @media (max-width: 600px) {
    .contact-form-grid {
      grid-template-columns: 1fr;
    }
    .contact-form-card {
      padding: 24px 20px;
    }
    .contact-title {
      font-size: 26px;
    }
    .contact-subtitle {
      font-size: 16px;
    }
  }
`;

export default Contact;
