import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Search,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { useServices } from "../features/services/useServices";
import { useEmployees } from "../features/employee/useEmployees";
import { useAvailableSlots } from "../features/booking/useAvailableSlots";
import { useHoldAppointment } from "../features/appointment/useHoldAppointment";
import SlotPicker from "../features/booking/SlotPicker";
import { useDarkMode } from "../hooks/useDarkMode";

const BookingPageWrapper = styled.div`
  min-height: 85vh;
  padding: 4rem 2rem 8rem;
  background: ${(props) =>
    props.$isDark
      ? "linear-gradient(180deg, #0f172a 0%, #090d16 100%)"
      : "linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)"};
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const PageHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 1.4rem;
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.12);
    color: #0284c7;
    font-size: 1.3rem;
    font-weight: 700;
  }

  h1 {
    font-size: 3.2rem;
    font-weight: 800;
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
    margin: 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1.6rem;
    color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
    max-width: 600px;
    margin: 0;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.6rem;
  margin-top: 1rem;

  @media (max-width: 640px) {
    gap: 0.8rem;
  }
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};

  .circle {
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 700;
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #0ea5e9, #2563eb)"
        : props.$completed
        ? "#10b981"
        : props.$isDark
        ? "#1e293b"
        : "#e2e8f0"};
    color: ${(props) =>
      props.$active || props.$completed ? "#ffffff" : props.$isDark ? "#94a3b8" : "#64748b"};
    box-shadow: ${(props) =>
      props.$active ? "0 4px 14px rgba(14, 165, 233, 0.4)" : "none"};
  }

  .label {
    font-size: 1.4rem;
    font-weight: 600;
    white-space: nowrap;
    color: ${(props) =>
      props.$active
        ? "#0284c7"
        : props.$completed
        ? "#10b981"
        : props.$isDark
        ? "#64748b"
        : "#94a3b8"};

    @media (max-width: 640px) {
      display: none;
    }
  }

  .line {
    width: 4rem;
    height: 2px;
    background: ${(props) =>
      props.$completed ? "#10b981" : props.$isDark ? "#334155" : "#cbd5e1"};
    margin-left: 0.8rem;

    @media (max-width: 640px) {
      width: 2rem;
    }
  }
`;

const BookingCard = styled.div`
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  border: 1px solid
    ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  border-radius: 1.6rem;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  @media (max-width: 640px) {
    padding: 2rem 1.6rem;
  }
`;

// STEP 1 STYLES: SERVICES SELECTION
const SearchBox = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    left: 1.4rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  input {
    width: 100%;
    padding: 1.4rem 1.4rem 1.4rem 4.4rem;
    border-radius: 1.2rem;
    border: 1px solid
      ${(props) => (props.$isDark ? "#334155" : "#cbd5e1")};
    background: ${(props) => (props.$isDark ? "#0f172a" : "#f8fafc")};
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
    font-size: 1.45rem;

    &:focus {
      outline: none;
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
    }
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.6rem;
`;

const ServiceCard = styled.div`
  border: 2px solid
    ${(props) =>
      props.$selected
        ? "#0284c7"
        : props.$isDark
        ? "#334155"
        : "#e2e8f0"};
  background: ${(props) =>
    props.$selected
      ? props.$isDark
        ? "rgba(14, 165, 233, 0.12)"
        : "#f0f9ff"
      : props.$isDark
      ? "#0f172a"
      : "#ffffff"};
  border-radius: 1.2rem;
  padding: 1.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    border-color: #0284c7;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  }

  .title {
    font-size: 1.6rem;
    font-weight: 700;
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
  }

  .desc {
    font-size: 1.3rem;
    color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
    line-height: 1.5;
    flex: 1;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px dashed
      ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
    padding-top: 1rem;

    .price {
      font-size: 1.6rem;
      font-weight: 800;
      color: #0284c7;
    }

    .duration {
      font-size: 1.2rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
  }
`;

// STEP 2 STYLES: DATE & SLOT
const StepTwoLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 3rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const SidebarConfig = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .config-block {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    label {
      font-size: 1.4rem;
      font-weight: 600;
      color: ${(props) => (props.$isDark ? "#e2e8f0" : "#334155")};
    }
  }

  .custom-datepicker {
    width: 100%;
    padding: 1.2rem;
    border-radius: 1rem;
    border: 1px solid
      ${(props) => (props.$isDark ? "#334155" : "#cbd5e1")};
    background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
    font-size: 1.4rem;
    font-weight: 600;
  }

  select {
    width: 100%;
    padding: 1.2rem;
    border-radius: 1rem;
    border: 1px solid
      ${(props) => (props.$isDark ? "#334155" : "#cbd5e1")};
    background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
    color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
    font-size: 1.4rem;
  }
`;

// STEP 3 STYLES: PATIENT FORM
const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 2;
    @media (max-width: 640px) {
      grid-column: span 1;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    label {
      font-size: 1.35rem;
      font-weight: 600;
      color: ${(props) => (props.$isDark ? "#cbd5e1" : "#334155")};
    }

    input,
    textarea {
      padding: 1.2rem 1.4rem;
      border-radius: 0.8rem;
      border: 1px solid
        ${(props) => (props.$isDark ? "#334155" : "#cbd5e1")};
      background: ${(props) => (props.$isDark ? "#0f172a" : "#f8fafc")};
      color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
      font-size: 1.4rem;

      &:focus {
        outline: none;
        border-color: #0284c7;
      }
    }
  }
`;

const BookingSummaryBox = styled.div`
  padding: 1.8rem;
  border-radius: 1.2rem;
  background: ${(props) =>
    props.$isDark ? "rgba(14, 165, 233, 0.08)" : "#f0f9ff"};
  border: 1px solid rgba(14, 165, 233, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  h4 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #0284c7;
    margin: 0;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 1.35rem;
    color: ${(props) => (props.$isDark ? "#cbd5e1" : "#475569")};

    span.bold {
      font-weight: 700;
      color: ${(props) => (props.$isDark ? "#ffffff" : "#0f172a")};
    }
  }
`;

const PrimaryBtn = styled.button`
  padding: 1.4rem 2.8rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
  color: white;
  font-size: 1.55rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.45);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryBtn = styled.button`
  padding: 1.2rem 2.2rem;
  border-radius: 999px;
  background: ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  color: ${(props) => (props.$isDark ? "#e2e8f0" : "#334155")};
  font-size: 1.45rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$isDark ? "#475569" : "#cbd5e1")};
  }
`;

export default function Booking() {
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get("serviceId") || "";

  const [step, setStep] = useState(initialServiceId ? 2 : 1);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [patientForm, setPatientForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const { services = [], isLoading: isLoadingServices } = useServices();
  const { employees = [] } = useEmployees();

  // Slots query
  const slotsQuery = useAvailableSlots({
    date: selectedDate,
    serviceId: selectedServiceId,
    employeeId: selectedDoctorId || undefined,
    enabled: Boolean(selectedDate && selectedServiceId),
  });

  const { mutateAsync: holdAppointment, isLoading: isHolding } =
    useHoldAppointment();

  const selectedService = useMemo(() => {
    return services.find((s) => s._id === selectedServiceId) || null;
  }, [services, selectedServiceId]);

  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) return services;
    const q = searchTerm.toLowerCase();
    return services.filter(
      (s) =>
        s.nameService?.toLowerCase().includes(q) ||
        s.summary?.toLowerCase().includes(q)
    );
  }, [services, searchTerm]);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.phone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại liên hệ");
      return;
    }

    if (!selectedSlot) {
      toast.error("Vui lòng chọn khung giờ khám");
      return;
    }

    try {
      // Hold slot in Redis via BE API
      const result = await holdAppointment({
        shift: selectedSlot.shiftId,
        Date: selectedDate,
        serviceId: selectedServiceId,
        slotStart: selectedSlot.slotStart,
        slotEnd: selectedSlot.slotEnd,
        patientName: patientForm.name,
        patientPhone: patientForm.phone,
        patientEmail: patientForm.email,
        notes: patientForm.notes,
      });

      toast.success("Giữ chỗ thành công! Đang chuyển đến trang thanh toán xác nhận...");
      
      const reservationId = result?.data?.reservationId || result?.reservationId;
      if (reservationId) {
        navigate(`/appointment/checkout?reservationId=${reservationId}`);
      } else {
        navigate("/account/appointments");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể giữ chỗ cho khung giờ này. Vui lòng thử lại!");
    }
  };

  return (
    <BookingPageWrapper $isDark={isDarkMode}>
      <Container>
        <PageHeader $isDark={isDarkMode}>
          <div className="badge">
            <Sparkles size={16} /> Đặt Lịch Trực Tuyến
          </div>
          <h1>ĐẶT LỊCH HẸN KHÁM NHA KHOA</h1>
          <p>
            Chọn dịch vụ, bác sĩ và khung giờ thuận tiện nhất chỉ với 3 bước đơn
            giản. Hệ thống giữ chỗ tức thì không lo trùng lịch.
          </p>

          <StepIndicator>
            <StepItem
              $active={step === 1}
              $completed={step > 1}
              $clickable={step > 1}
              $isDark={isDarkMode}
              onClick={() => step > 1 && setStep(1)}
            >
              <div className="circle">1</div>
              <div className="label">Chọn Dịch Vụ</div>
              <div className="line" />
            </StepItem>

            <StepItem
              $active={step === 2}
              $completed={step > 2}
              $clickable={Boolean(selectedServiceId && step > 2)}
              $isDark={isDarkMode}
              onClick={() => selectedServiceId && setStep(2)}
            >
              <div className="circle">2</div>
              <div className="label">Chọn Giờ Khám</div>
              <div className="line" />
            </StepItem>

            <StepItem
              $active={step === 3}
              $completed={false}
              $isDark={isDarkMode}
            >
              <div className="circle">3</div>
              <div className="label">Xác Nhận Giữ Chỗ</div>
            </StepItem>
          </StepIndicator>
        </PageHeader>

        <BookingCard $isDark={isDarkMode}>
          {/* STEP 1: CHỌN DỊCH VỤ */}
          {step === 1 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
                  Bước 1: Chọn dịch vụ bạn cần khám
                </h3>
              </div>

              <SearchBox $isDark={isDarkMode}>
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ (Niềng răng, Trồng Implant, Tẩy trắng...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchBox>

              <ServicesGrid>
                {filteredServices.map((svc) => (
                  <ServiceCard
                    key={svc._id}
                    $selected={selectedServiceId === svc._id}
                    $isDark={isDarkMode}
                    onClick={() => {
                      setSelectedServiceId(svc._id);
                      setStep(2);
                    }}
                  >
                    <div className="title">{svc.nameService}</div>
                    <div className="desc">{svc.summary || "Dịch vụ nha khoa chuyên sâu chất lượng cao."}</div>
                    <div className="meta">
                      <div className="price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(svc.priceDiscount || svc.priceService || 0)}
                      </div>
                      <div className="duration">
                        <Clock size={14} />
                        <span>{svc.durationMinutes || 30} phút</span>
                      </div>
                    </div>
                  </ServiceCard>
                ))}
              </ServicesGrid>
            </>
          )}

          {/* STEP 2: CHỌN NGÀY & KHUNG GIỜ */}
          {step === 2 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
                    Bước 2: Chọn ngày & Khung giờ phù hợp
                  </h3>
                  <p style={{ color: "#0284c7", fontWeight: 600, fontSize: "1.4rem", margin: "0.4rem 0 0 0" }}>
                    Dịch vụ: {selectedService?.nameService} (
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedService?.priceDiscount || selectedService?.priceService || 0)}
                    )
                  </p>
                </div>
                <SecondaryBtn $isDark={isDarkMode} onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Đổi dịch vụ
                </SecondaryBtn>
              </div>

              <StepTwoLayout>
                <SidebarConfig $isDark={isDarkMode}>
                  <div className="config-block">
                    <label>
                      <CalendarIcon size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
                      Ngày khám mong muốn:
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      className="custom-datepicker"
                    />
                  </div>

                  <div className="config-block">
                    <label>
                      <User size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
                      Bác sĩ điều trị:
                    </label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => {
                        setSelectedDoctorId(e.target.value);
                        setSelectedSlot(null);
                      }}
                    >
                      <option value="">-- Tất cả bác sĩ có ca --</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.experience || "Bác sĩ"})
                        </option>
                      ))}
                    </select>
                  </div>
                </SidebarConfig>

                <div>
                  <h4 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.2rem" }}>
                    Các khung giờ trống khả dụng (Slot):
                  </h4>
                  {slotsQuery.isLoading ? (
                    <p style={{ color: "#94a3b8" }}>Đang kiểm tra lịch trống của bác sĩ...</p>
                  ) : (
                    <SlotPicker
                      slots={slotsQuery.data || []}
                      selectedSlotStart={selectedSlot?.slotStart}
                      onSelectSlot={handleSelectSlot}
                    />
                  )}
                </div>
              </StepTwoLayout>
            </>
          )}

          {/* STEP 3: THÔNG TIN BỆNH NHÂN & XÁC NHẬN */}
          {step === 3 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
                  Bước 3: Thông tin người khám & Giữ chỗ
                </h3>
                <SecondaryBtn $isDark={isDarkMode} onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Chọn lại giờ
                </SecondaryBtn>
              </div>

              <BookingSummaryBox $isDark={isDarkMode}>
                <h4>📋 Tóm tắt thông tin lịch hẹn</h4>
                <div className="summary-row">
                  <span>Dịch vụ khám:</span>
                  <span className="bold">{selectedService?.nameService}</span>
                </div>
                <div className="summary-row">
                  <span>Ngày khám:</span>
                  <span className="bold">
                    {selectedDate ? selectedDate.toLocaleDateString("vi-VN") : "-"}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Khung giờ hẹn:</span>
                  <span className="bold" style={{ color: "#0284c7" }}>
                    {selectedSlot?.slotStart} - {selectedSlot?.slotEnd}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Bác sĩ phụ trách:</span>
                  <span className="bold">{selectedSlot?.doctorName || "Bác sĩ chuyên khoa"}</span>
                </div>
                <div className="summary-row">
                  <span>Chi phí dự kiến:</span>
                  <span className="bold" style={{ color: "#10b981", fontSize: "1.6rem" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedSlot?.price || selectedService?.priceService || 0)}
                  </span>
                </div>
              </BookingSummaryBox>

              <FormGrid $isDark={isDarkMode} onSubmit={handleConfirmBooking}>
                <div className="field">
                  <label>
                    <User size={15} style={{ display: "inline", marginRight: "0.4rem" }} />
                    Họ và tên bệnh nhân (*):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={patientForm.name}
                    onChange={(e) =>
                      setPatientForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>

                <div className="field">
                  <label>
                    <Phone size={15} style={{ display: "inline", marginRight: "0.4rem" }} />
                    Số điện thoại liên hệ (*):
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={patientForm.phone}
                    onChange={(e) =>
                      setPatientForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>

                <div className="field full-width">
                  <label>
                    <Mail size={15} style={{ display: "inline", marginRight: "0.4rem" }} />
                    Địa chỉ Email (nhận vé hẹn & lời nhắc tự động):
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={patientForm.email}
                    onChange={(e) =>
                      setPatientForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>

                <div className="field full-width">
                  <label>
                    <FileText size={15} style={{ display: "inline", marginRight: "0.4rem" }} />
                    Mô tả triệu chứng răng miệng / Yêu cầu đặc biệt:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Răng hàm dưới bên phải đau nhức khi nhai, muốn cạo vôi răng và trám răng..."
                    value={patientForm.notes}
                    onChange={(e) =>
                      setPatientForm((prev) => ({ ...prev, notes: e.target.value }))
                    }
                  />
                </div>

                <div className="full-width" style={{ display: "flex", justifyContent: "flex-end" }}>
                  <PrimaryBtn type="submit" disabled={isHolding}>
                    <ShieldCheck size={20} />
                    <span>{isHolding ? "Đang giữ chỗ..." : "Xác Nhận Giữ Chỗ Ngay"}</span>
                  </PrimaryBtn>
                </div>
              </FormGrid>
            </>
          )}
        </BookingCard>
      </Container>
    </BookingPageWrapper>
  );
}
