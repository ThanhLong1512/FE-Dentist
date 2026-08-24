import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useLanguage } from "../context/LanguageContext";
import { useServices } from "../features/services/useServices";
import { useAvailableSlots } from "../features/booking/useAvailableSlots";
import { useHoldAppointment } from "../features/appointment/useHoldAppointment";
import SlotPicker from "../features/booking/SlotPicker";
import "./Contact.css";

function Contact() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    appointmentDate: null,
    serviceId: "",
  });

  const [selectedSlot, setSelectedSlot] = useState(null);

  const { services = [] } = useServices();

  const slotsQuery = useAvailableSlots({
    date: formData.appointmentDate,
    serviceId: formData.serviceId,
  });

  const { mutateAsync: holdAppointment, isLoading: isHolding } =
    useHoldAppointment();

  const selectedService = useMemo(() => {
    if (!formData.serviceId) return null;
    return (
      services.find((s) => String(s._id) === String(formData.serviceId)) || null
    );
  }, [formData.serviceId, services]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    setFormData((prev) => ({ ...prev, serviceId: e.target.value }));
    setSelectedSlot(null);
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, appointmentDate: date }));
    setSelectedSlot(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        !formData.serviceId ||
        !selectedSlot
      ) {
        toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
        return;
      }

      const holdResponse = await holdAppointment({
        shift: selectedSlot.shiftId,
        Date: formData.appointmentDate.toISOString(),
        serviceId: formData.serviceId,
        slotStart: selectedSlot.slotStart,
        slotEnd: selectedSlot.slotEnd,
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
            doctorName: selectedSlot.doctorName || "Bác sĩ",
            serviceName: selectedService?.nameService || "Dịch vụ",
            serviceId: formData.serviceId,
            totalPrice:
              selectedSlot.price || selectedService?.priceService || 0,
            slotTime: `${selectedSlot.slotStart} - ${selectedSlot.slotEnd}`,
            slotStart: selectedSlot.slotStart,
            slotEnd: selectedSlot.slotEnd,
            shiftId: selectedSlot.shiftId,
          },
        },
      });
    } catch (error) {
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

                  <div className="contact-field contact-field-full">
                    <label htmlFor="serviceId">Dịch vụ</label>
                    <select
                      id="serviceId"
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleServiceChange}
                      required
                    >
                      <option value="">Chọn dịch vụ</option>
                      {services.map((svc) => (
                        <option key={svc._id} value={svc._id}>
                          {svc.nameService} ({svc.durationMinutes ?? 30} phút)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="contact-field contact-field-full" style={{ marginTop: 12 }}>
                  <label>Chọn khung giờ</label>
                  {slotsQuery.isLoading ? (
                    <div style={{ color: "#64748b" }}>Đang tải...</div>
                  ) : (
                    <SlotPicker
                      slots={slotsQuery.data || []}
                      selectedSlotStart={selectedSlot?.slotStart}
                      onSelectSlot={(slot) => setSelectedSlot(slot)}
                    />
                  )}
                </div>

                {selectedSlot && (
                  <div style={{ marginTop: 10, color: "#0f172a" }}>
                    <strong>Đã chọn:</strong> {selectedSlot.doctorName} -{" "}
                    {selectedSlot.slotStart} - {selectedSlot.slotEnd}
                  </div>
                )}

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

                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={slotsQuery.isLoading || isHolding}
                >
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
                  <span className="contact-info-label">Địa chỉ</span>
                  <span className="contact-info-value">Phòng khám (demo)</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Contact;

