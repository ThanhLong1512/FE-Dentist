import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Building2,
  CalendarClock,
  CreditCard,
  BellRing,
  Save,
  RotateCcw,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

import Spinner from "../../components/admin/Spinner";
import Input from "../../components/admin/Input";
import Button from "../../components/admin/Button";
import { Textarea } from "../../components/admin/Textarea";
import FormRow, { FormGrid } from "../../components/admin/FormRow";
import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";
import { handleResetSettings } from "../../apis";
import ConfirmModal from "../../components/ConfirmModal";

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

const TabList = styled.div`
  display: flex;
  gap: 0.8rem;
  border-bottom: 1px solid var(--color-grey-200);
  padding-bottom: 1.2rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.8rem;
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;

  background-color: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-100)"};
  color: ${(props) =>
    props.$active ? "#ffffff" : "var(--color-grey-600)"};

  &:hover {
    background-color: ${(props) =>
      props.$active ? "var(--color-brand-700)" : "var(--color-grey-200)"};
  }

  svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const SettingsCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  padding-bottom: 1.6rem;

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-grey-800);
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin: 0;
  }

  p {
    font-size: 1.35rem;
    color: var(--color-grey-400);
    margin: 0;
  }
`;

const SwitchContainer = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 1.8rem;
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-grey-300);
    background: var(--color-grey-100);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .title {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-700);
  }

  .desc {
    font-size: 1.25rem;
    color: var(--color-grey-400);
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 4.8rem;
  height: 2.6rem;
  background-color: ${(props) =>
    props.$checked ? "var(--color-brand-600)" : "var(--color-grey-300)"};
  border-radius: 9999px;
  transition: background-color 0.2s;
  flex-shrink: 0;

  &::after {
    content: "";
    position: absolute;
    top: 0.3rem;
    left: ${(props) => (props.$checked ? "2.5rem" : "0.3rem")};
    width: 2rem;
    height: 2rem;
    background-color: #ffffff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: left 0.2s;
  }
`;

const HiddenCheckbox = styled.input`
  display: none;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  flex-wrap: wrap;
  padding-top: 1rem;
`;

function UpdateSettingsForm() {
  const { isLoading, settings = {} } = useSettings();
  const { isUpdating, updateSetting } = useUpdateSetting();
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        clinicName: settings.clinicName || "",
        slogan: settings.slogan || "",
        hotline: settings.hotline || "",
        supportEmail: settings.supportEmail || "",
        headquarterAddress: settings.headquarterAddress || "",
        licenseNumber: settings.licenseNumber || "",
        openHours: settings.openHours || "",

        holdSeatTtlSeconds: settings.holdSeatTtlSeconds ?? 300,
        bufferMinutes: settings.bufferMinutes ?? 10,
        maxAdvanceBookingDays: settings.maxAdvanceBookingDays ?? 30,
        minHoursBeforeCancel: settings.minHoursBeforeCancel ?? 24,

        depositPercentage: settings.depositPercentage ?? 20,
        vatPercentage: settings.vatPercentage ?? 8,
        enableOnlinePayment: settings.enableOnlinePayment ?? true,
        enableCashPayment: settings.enableCashPayment ?? true,

        emailNotificationEnabled: settings.emailNotificationEnabled ?? true,
        appointmentReminderHours: settings.appointmentReminderHours ?? 24,
        adminSoundAlerts: settings.adminSoundAlerts ?? true,
      });
    }
  }, [settings]);

  if (isLoading) return <Spinner />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggle = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      holdSeatTtlSeconds: Number(formData.holdSeatTtlSeconds) || 300,
      bufferMinutes: Number(formData.bufferMinutes) || 10,
      maxAdvanceBookingDays: Number(formData.maxAdvanceBookingDays) || 30,
      minHoursBeforeCancel: Number(formData.minHoursBeforeCancel) || 24,
      depositPercentage: Number(formData.depositPercentage) || 0,
      vatPercentage: Number(formData.vatPercentage) || 0,
      appointmentReminderHours: Number(formData.appointmentReminderHours) || 24,
    };

    updateSetting(formattedData);
  };

  const handleResetToDefault = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = async () => {
    try {
      setIsResetting(true);
      const res = await handleResetSettings();
      toast.success("Đã khôi phục cài đặt mặc định!");
      if (res?.data) {
        setFormData(res.data);
      }
    } catch (err) {
      toast.error("Không thể khôi phục cài đặt");
    } finally {
      setIsResetting(false);
      setShowResetConfirm(false);
    }
  };

  return (
    <SettingsContainer>
      <TabList>
        <TabButton
          type="button"
          $active={activeTab === "general"}
          onClick={() => setActiveTab("general")}
        >
          <Building2 />
          <span>Thông tin phòng khám</span>
        </TabButton>

        <TabButton
          type="button"
          $active={activeTab === "booking"}
          onClick={() => setActiveTab("booking")}
        >
          <CalendarClock />
          <span>Chính sách đặt hẹn</span>
        </TabButton>

        <TabButton
          type="button"
          $active={activeTab === "finance"}
          onClick={() => setActiveTab("finance")}
        >
          <CreditCard />
          <span>Thanh toán & Tài chính</span>
        </TabButton>

        <TabButton
          type="button"
          $active={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
        >
          <BellRing />
          <span>Thông báo & Email</span>
        </TabButton>
      </TabList>

      <form onSubmit={handleSubmit}>
        {activeTab === "general" && (
          <SettingsCard>
            <SectionHeader>
              <h3>
                <Building2 color="var(--color-brand-600)" />
                Thông tin Thương hiệu & Trụ sở
              </h3>
              <p>Quản lý tên phòng khám, hotline, email liên hệ và thông tin pháp lý chung</p>
            </SectionHeader>

            <FormGrid columns={2}>
              <FormRow label="Tên hệ thống nha khoa (*)">
                <Input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName || ""}
                  onChange={handleChange}
                  placeholder="VD: Nha Khoa Smile Care"
                  disabled={isUpdating}
                  required
                />
              </FormRow>

              <FormRow label="Khẩu hiệu / Slogan thương hiệu">
                <Input
                  type="text"
                  name="slogan"
                  value={formData.slogan || ""}
                  onChange={handleChange}
                  placeholder="VD: Nụ cười rạng rỡ - Tự tin tỏa sáng"
                  disabled={isUpdating}
                />
              </FormRow>
            </FormGrid>

            <FormGrid columns={2}>
              <FormRow label="Hotline tổng đài tư vấn (*)">
                <Input
                  type="tel"
                  name="hotline"
                  value={formData.hotline || ""}
                  onChange={handleChange}
                  placeholder="VD: 1900 6868"
                  disabled={isUpdating}
                  required
                />
              </FormRow>

              <FormRow label="Email tiếp nhận hỗ trợ (*)">
                <Input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail || ""}
                  onChange={handleChange}
                  placeholder="VD: support@smilecare.vn"
                  disabled={isUpdating}
                  required
                />
              </FormRow>
            </FormGrid>

            <FormGrid columns={2}>
              <FormRow label="Giấy phép hoạt động y tế">
                <Input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber || ""}
                  onChange={handleChange}
                  placeholder="VD: GP-0892/SYT-GPHĐ"
                  disabled={isUpdating}
                />
              </FormRow>

              <FormRow label="Khung giờ phục vụ chung">
                <Input
                  type="text"
                  name="openHours"
                  value={formData.openHours || ""}
                  onChange={handleChange}
                  placeholder="VD: 08:00 - 20:00 (Thứ 2 - CN)"
                  disabled={isUpdating}
                />
              </FormRow>
            </FormGrid>

            <FormRow label="Địa chỉ trụ sở chính (*)">
              <Textarea
                rows={2}
                name="headquarterAddress"
                value={formData.headquarterAddress || ""}
                onChange={handleChange}
                placeholder="VD: 120 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh"
                disabled={isUpdating}
                required
              />
            </FormRow>
          </SettingsCard>
        )}

        {activeTab === "booking" && (
          <SettingsCard>
            <SectionHeader>
              <h3>
                <CalendarClock color="var(--color-brand-600)" />
                Chính sách Đặt hẹn & Quy tắc Slot khám
              </h3>
              <p>Điều chỉnh các thông số vận hành ca khám, thời gian giữ chỗ và điều kiện hủy hẹn</p>
            </SectionHeader>

            <FormGrid columns={2}>
              <FormRow
                label="Thời gian giữ chỗ thanh toán (giây)"
                error="Bệnh nhân có khoảng thời gian này để hoàn tất thanh toán trước khi nhả slot"
              >
                <Input
                  type="number"
                  name="holdSeatTtlSeconds"
                  min={60}
                  step={30}
                  value={formData.holdSeatTtlSeconds ?? 300}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
              </FormRow>

              <FormRow
                label="Thời gian đệm giữa 2 ca liên tiếp (phút)"
                error="Khoảng nghỉ để y tá sát khuẩn thiết bị trước ca điều trị tiếp theo"
              >
                <Input
                  type="number"
                  name="bufferMinutes"
                  min={0}
                  max={60}
                  value={formData.bufferMinutes ?? 10}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
              </FormRow>
            </FormGrid>

            <FormGrid columns={2}>
              <FormRow
                label="Giới hạn đặt hẹn trước tối đa (ngày)"
                error="Bệnh nhân chỉ được phép đặt lịch trong phạm vi số ngày này"
              >
                <Input
                  type="number"
                  name="maxAdvanceBookingDays"
                  min={1}
                  max={180}
                  value={formData.maxAdvanceBookingDays ?? 30}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
              </FormRow>

              <FormRow
                label="Thời hạn hủy lịch tối thiểu (giờ)"
                error="Bệnh nhân phải báo trước ít nhất khoảng thời gian này để được hoàn cọc"
              >
                <Input
                  type="number"
                  name="minHoursBeforeCancel"
                  min={0}
                  max={72}
                  value={formData.minHoursBeforeCancel ?? 24}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
              </FormRow>
            </FormGrid>
          </SettingsCard>
        )}

        {activeTab === "finance" && (
          <SettingsCard>
            <SectionHeader>
              <h3>
                <CreditCard color="var(--color-brand-600)" />
                Thanh toán, Hóa đơn & Tài chính
              </h3>
              <p>Thiết lập tỷ lệ cọc giữ chỗ, thuế suất và các phương thức thanh toán được kích hoạt</p>
            </SectionHeader>

            <FormGrid columns={2}>
              <FormRow
                label="Tỷ lệ đặt cọc khi đặt hẹn online (%)"
                error="Tỷ lệ phần trăm tổng chi phí dịch vụ bệnh nhân cần cọc trước"
              >
                <Input
                  type="number"
                  name="depositPercentage"
                  min={0}
                  max={100}
                  value={formData.depositPercentage ?? 20}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
              </FormRow>

              <FormRow
                label="Thuế suất GTGT / VAT xuất hóa đơn (%)"
                error="Áp dụng khi lập hóa đơn thanh toán cho khách hàng"
              >
                <Input
                  type="number"
                  name="vatPercentage"
                  min={0}
                  max={30}
                  value={formData.vatPercentage ?? 8}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
              </FormRow>
            </FormGrid>

            <FormGrid columns={2}>
              <SwitchContainer onClick={() => handleToggle("enableOnlinePayment")}>
                <div className="info">
                  <span className="title">Cổng thanh toán Online (VNPAY / Thẻ)</span>
                  <span className="desc">Cho phép khách hàng thanh toán trực tuyến qua VNPAY hoặc thẻ ngân hàng</span>
                </div>
                <ToggleSwitch $checked={Boolean(formData.enableOnlinePayment)} />
                <HiddenCheckbox
                  type="checkbox"
                  name="enableOnlinePayment"
                  checked={Boolean(formData.enableOnlinePayment)}
                  onChange={handleChange}
                />
              </SwitchContainer>

              <SwitchContainer onClick={() => handleToggle("enableCashPayment")}>
                <div className="info">
                  <span className="title">Thanh toán Tiền mặt tại phòng khám</span>
                  <span className="desc">Cho phép bệnh nhân thanh toán trực tiếp tại quầy lễ tân chi nhánh</span>
                </div>
                <ToggleSwitch $checked={Boolean(formData.enableCashPayment)} />
                <HiddenCheckbox
                  type="checkbox"
                  name="enableCashPayment"
                  checked={Boolean(formData.enableCashPayment)}
                  onChange={handleChange}
                />
              </SwitchContainer>
            </FormGrid>
          </SettingsCard>
        )}

        {activeTab === "notifications" && (
          <SettingsCard>
            <SectionHeader>
              <h3>
                <BellRing color="var(--color-brand-600)" />
                Thông báo & Email Tự động
              </h3>
              <p>Cấu hình gửi email tự động xác nhận lịch hẹn, hóa đơn và cảnh báo thời gian thực</p>
            </SectionHeader>

            <FormGrid columns={2}>
              <SwitchContainer onClick={() => handleToggle("emailNotificationEnabled")}>
                <div className="info">
                  <span className="title">Tự động gửi Email xác nhận đặt lịch</span>
                  <span className="desc">Gửi thông tin lịch hẹn và mã QR check-in qua email cho bệnh nhân</span>
                </div>
                <ToggleSwitch $checked={Boolean(formData.emailNotificationEnabled)} />
                <HiddenCheckbox
                  type="checkbox"
                  name="emailNotificationEnabled"
                  checked={Boolean(formData.emailNotificationEnabled)}
                  onChange={handleChange}
                />
              </SwitchContainer>

              <SwitchContainer onClick={() => handleToggle("adminSoundAlerts")}>
                <div className="info">
                  <span className="title">Âm thanh cảnh báo Lịch hẹn mới cho Admin</span>
                  <span className="desc">Phát chuông thông báo tức thì khi có bệnh nhân đặt lịch thành công</span>
                </div>
                <ToggleSwitch $checked={Boolean(formData.adminSoundAlerts)} />
                <HiddenCheckbox
                  type="checkbox"
                  name="adminSoundAlerts"
                  checked={Boolean(formData.adminSoundAlerts)}
                  onChange={handleChange}
                />
              </SwitchContainer>
            </FormGrid>

            <FormRow
              label="Thời gian gửi Email nhắc hẹn trước giờ khám (giờ)"
              error="Hệ thống sẽ gửi email nhắc nhở bệnh nhân trước thời gian này"
            >
              <Input
                type="number"
                name="appointmentReminderHours"
                min={1}
                max={72}
                value={formData.appointmentReminderHours ?? 24}
                onChange={handleChange}
                disabled={isUpdating}
                style={{ maxWidth: "24rem" }}
              />
            </FormRow>
          </SettingsCard>
        )}

        <ActionBar>
          <Button
            type="button"
            variation="secondary"
            onClick={handleResetToDefault}
            disabled={isUpdating}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}
          >
            <RotateCcw size={16} />
            <span>Khôi phục mặc định</span>
          </Button>

          <Button
            type="submit"
            disabled={isUpdating}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", padding: "1.2rem 2.4rem" }}
          >
            <Save size={18} />
            <span>{isUpdating ? "Đang lưu cấu hình..." : "Lưu cài đặt hệ thống"}</span>
          </Button>
        </ActionBar>
      </form>

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => !isResetting && setShowResetConfirm(false)}
        onConfirm={handleConfirmReset}
        title="Khôi phục cài đặt mặc định?"
        message="Hành động này sẽ thiết lập lại tất cả các thông số phòng khám, đặt lịch và thanh toán về trạng thái ban đầu của hệ thống. Bạn có chắc chắn muốn tiếp tục?"
        confirmText="Khôi phục mặc định"
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isResetting}
      />
    </SettingsContainer>
  );
}

export default UpdateSettingsForm;
