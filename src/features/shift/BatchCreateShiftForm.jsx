import { useState, useMemo } from "react";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  UserCheck,
  Sparkles,
  Check,
  AlertCircle,
  Sun,
  Sunset,
  Moon,
  Plus,
} from "lucide-react";
import { useEmployees } from "../employee/useEmployees";
import { useCreateBatchShifts } from "./useCreateBatchShifts";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  width: 64rem;
  max-width: 90vw;
  font-size: 1.4rem;
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-bottom: 1px solid var(--color-grey-200);
  padding-bottom: 1.6rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-grey-800);
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin: 0;
  }

  p {
    font-size: 1.3rem;
    color: var(--color-grey-500);
    margin: 0;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.label`
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-grey-700);
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 1.1rem 1.4rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-800);
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
  }
`;

const PresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const PresetChip = styled.button`
  background: ${(props) =>
    props.$active ? "var(--color-brand-50)" : "var(--color-grey-100)"};
  border: 1px solid
    ${(props) =>
      props.$active ? "var(--color-brand-500)" : "var(--color-grey-200)"};
  color: ${(props) =>
    props.$active ? "var(--color-brand-700)" : "var(--color-grey-600)"};
  font-size: 1.25rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-brand-50);
    color: var(--color-brand-700);
    border-color: var(--color-brand-300);
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.8rem;

  @media (max-width: 600px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const DayCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 1.2rem 0.6rem;
  border-radius: var(--border-radius-md);
  border: 2px solid
    ${(props) =>
      props.$selected ? "var(--color-brand-600)" : "var(--color-grey-200)"};
  background: ${(props) =>
    props.$selected ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  color: ${(props) =>
    props.$selected ? "var(--color-brand-700)" : "var(--color-grey-700)"};
  cursor: pointer;
  transition: all 0.2s;

  .day-label {
    font-size: 1.3rem;
    font-weight: 700;
  }

  .day-name {
    font-size: 1rem;
    color: var(--color-grey-400);
  }

  &:hover {
    border-color: var(--color-brand-400);
    transform: translateY(-2px);
  }
`;

const ShiftsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ShiftCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.4rem;
  border-radius: var(--border-radius-md);
  border: 2px solid
    ${(props) =>
      props.$checked ? "var(--color-brand-600)" : "var(--color-grey-200)"};
  background: ${(props) =>
    props.$checked ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  cursor: pointer;
  transition: all 0.2s;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
    font-size: 1.35rem;
    color: ${(props) =>
      props.$checked ? "var(--color-brand-700)" : "var(--color-grey-800)"};

    .icon-title {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
  }

  .time {
    font-size: 1.3rem;
    color: ${(props) =>
      props.$checked ? "var(--color-brand-600)" : "var(--color-grey-500)"};
    font-weight: 600;
  }

  &:hover {
    border-color: var(--color-brand-400);
  }
`;

const CustomTimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.4rem;
  background: var(--color-grey-50);
  border: 1px dashed var(--color-grey-300);
  border-radius: var(--border-radius-md);

  input[type="time"] {
    padding: 0.8rem 1rem;
    border: 1px solid var(--color-grey-200);
    border-radius: var(--border-radius-sm);
    background: var(--color-grey-0);
    color: var(--color-grey-800);
    font-size: 1.3rem;
  }
`;

const SummaryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 1.8rem;
  background: var(--color-brand-50);
  border: 1px solid var(--color-brand-200);
  border-radius: var(--border-radius-md);
  color: var(--color-brand-900);

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    .count {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-brand-700);
    }

    .desc {
      font-size: 1.25rem;
      color: var(--color-brand-800);
    }
  }
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.2rem;
  border-top: 1px solid var(--color-grey-200);
  padding-top: 1.6rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &.secondary {
    background: var(--color-grey-100);
    color: var(--color-grey-700);
    &:hover {
      background: var(--color-grey-200);
    }
  }

  &.primary {
    background: var(--color-brand-gradient);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(2, 132, 199, 0.4);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const DAYS = [
  { key: "Monday", label: "T2", name: "Thứ Hai" },
  { key: "Tuesday", label: "T3", name: "Thứ Ba" },
  { key: "Wednesday", label: "T4", name: "Thứ Tư" },
  { key: "Thursday", label: "T5", name: "Thứ Năm" },
  { key: "Friday", label: "T6", name: "Thứ Sáu" },
  { key: "Saturday", label: "T7", name: "Thứ Bảy" },
  { key: "Sunday", label: "CN", name: "Chủ Nhật" },
];

const PRESET_SHIFTS = [
  {
    id: "morning",
    name: "Ca Sáng",
    StartTime: "08:00",
    EndTime: "12:00",
    icon: <Sun size={17} color="#f59e0b" />,
  },
  {
    id: "afternoon",
    name: "Ca Chiều",
    StartTime: "13:30",
    EndTime: "17:30",
    icon: <Sunset size={17} color="#0284c7" />,
  },
  {
    id: "evening",
    name: "Ca Tối",
    StartTime: "18:00",
    EndTime: "21:00",
    icon: <Moon size={17} color="#6366f1" />,
  },
];

function BatchCreateShiftForm({ onCloseModal }) {
  const { employees = [] } = useEmployees();
  const { isBatchCreating, createBatchShifts } = useCreateBatchShifts();

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDays, setSelectedDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [selectedShiftIds, setSelectedShiftIds] = useState([
    "morning",
    "afternoon",
  ]);

  // Custom shift support
  const [useCustomShift, setUseCustomShift] = useState(false);
  const [customStart, setCustomStart] = useState("08:00");
  const [customEnd, setCustomEnd] = useState("17:00");

  const toggleDay = (dayKey) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey) ? prev.filter((d) => d !== dayKey) : [...prev, dayKey]
    );
  };

  const applyDayPreset = (presetType) => {
    switch (presetType) {
      case "weekdays":
        setSelectedDays([
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ]);
        break;
      case "standard":
        setSelectedDays([
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ]);
        break;
      case "all":
        setSelectedDays(DAYS.map((d) => d.key));
        break;
      case "246":
        setSelectedDays(["Monday", "Wednesday", "Friday"]);
        break;
      case "357":
        setSelectedDays(["Tuesday", "Thursday", "Saturday"]);
        break;
      case "none":
        setSelectedDays([]);
        break;
      default:
        break;
    }
  };

  const toggleShiftPreset = (shiftId) => {
    setSelectedShiftIds((prev) =>
      prev.includes(shiftId)
        ? prev.filter((id) => id !== shiftId)
        : [...prev, shiftId]
    );
  };

  // Compile list of shifts to register
  const shiftsToCreate = useMemo(() => {
    const list = [];
    if (!selectedDoctor || selectedDays.length === 0) return list;

    // Standard preset shifts
    const activePresets = PRESET_SHIFTS.filter((s) =>
      selectedShiftIds.includes(s.id)
    );

    for (const day of selectedDays) {
      for (const preset of activePresets) {
        list.push({
          DayOfWeek: day,
          StartTime: preset.StartTime,
          EndTime: preset.EndTime,
        });
      }
      if (useCustomShift && customStart && customEnd) {
        list.push({
          DayOfWeek: day,
          StartTime: customStart,
          EndTime: customEnd,
        });
      }
    }

    return list;
  }, [
    selectedDoctor,
    selectedDays,
    selectedShiftIds,
    useCustomShift,
    customStart,
    customEnd,
  ]);

  const doctorObj = employees.find((e) => e._id === selectedDoctor);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error("Vui lòng chọn bác sĩ!");
      return;
    }
    if (selectedDays.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ngày trong tuần!");
      return;
    }
    if (selectedShiftIds.length === 0 && !useCustomShift) {
      toast.error("Vui lòng chọn ít nhất một ca làm việc!");
      return;
    }
    if (shiftsToCreate.length === 0) {
      toast.error("Không có ca trực nào để đăng ký!");
      return;
    }

    createBatchShifts(
      {
        employee: selectedDoctor,
        shifts: shiftsToCreate,
      },
      {
        onSuccess: () => {
          onCloseModal?.();
        },
      }
    );
  };

  return (
    <FormContainer as="form" onSubmit={handleSubmit}>
      <FormHeader>
        <h2>
          <Sparkles size={22} color="var(--color-brand-600)" />
          Đăng ký ca trực nhanh & hàng loạt
        </h2>
        <p>
          Chọn bác sĩ, chọn nhiều ngày và các khung ca trực để tạo lịch làm việc
          tự động chỉ trong 1 lần nhấn chuột.
        </p>
      </FormHeader>

      {/* 1. Chọn Bác sĩ */}
      <Section>
        <SectionTitle>
          <UserCheck size={16} color="var(--color-brand-600)" />
          1. Chọn Bác sĩ phụ trách *
        </SectionTitle>
        <StyledSelect
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          required
        >
          <option value="">-- Chọn bác sĩ từ danh sách nhân sự --</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} {emp.service?.nameService ? `(${emp.service.nameService})` : ""}
            </option>
          ))}
        </StyledSelect>
      </Section>

      {/* 2. Chọn ngày */}
      <Section>
        <SectionTitle>
          <Calendar size={16} color="var(--color-brand-600)" />
          2. Chọn các ngày áp dụng trong tuần *
        </SectionTitle>

        <PresetRow>
          <PresetChip
            type="button"
            onClick={() => applyDayPreset("weekdays")}
            $active={
              selectedDays.length === 5 &&
              !selectedDays.includes("Saturday") &&
              !selectedDays.includes("Sunday")
            }
          >
            Thứ 2 - Thứ 6
          </PresetChip>
          <PresetChip
            type="button"
            onClick={() => applyDayPreset("standard")}
            $active={selectedDays.length === 6 && !selectedDays.includes("Sunday")}
          >
            Thứ 2 - Thứ 7
          </PresetChip>
          <PresetChip
            type="button"
            onClick={() => applyDayPreset("all")}
            $active={selectedDays.length === 7}
          >
            Cả tuần (T2 - CN)
          </PresetChip>
          <PresetChip type="button" onClick={() => applyDayPreset("246")}>
            Thứ 2, 4, 6
          </PresetChip>
          <PresetChip type="button" onClick={() => applyDayPreset("357")}>
            Thứ 3, 5, 7
          </PresetChip>
          <PresetChip type="button" onClick={() => applyDayPreset("none")}>
            Bỏ chọn
          </PresetChip>
        </PresetRow>

        <DaysGrid>
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day.key);
            return (
              <DayCard
                key={day.key}
                type="button"
                $selected={isSelected}
                onClick={() => toggleDay(day.key)}
              >
                <span className="day-label">{day.label}</span>
                <span className="day-name">{day.name}</span>
              </DayCard>
            );
          })}
        </DaysGrid>
      </Section>

      {/* 3. Chọn ca làm việc */}
      <Section>
        <SectionTitle>
          <Clock size={16} color="var(--color-brand-600)" />
          3. Chọn các khung ca trực *
        </SectionTitle>

        <ShiftsGrid>
          {PRESET_SHIFTS.map((preset) => {
            const isChecked = selectedShiftIds.includes(preset.id);
            return (
              <ShiftCard
                key={preset.id}
                $checked={isChecked}
                onClick={() => toggleShiftPreset(preset.id)}
              >
                <div className="header">
                  <div className="icon-title">
                    {preset.icon}
                    <span>{preset.name}</span>
                  </div>
                  {isChecked && <Check size={16} color="var(--color-brand-600)" />}
                </div>
                <span className="time">
                  {preset.StartTime} - {preset.EndTime}
                </span>
              </ShiftCard>
            );
          })}
        </ShiftsGrid>

        {/* Tùy chỉnh thêm ca nếu muốn */}
        <div style={{ marginTop: "0.8rem" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "var(--color-grey-600)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={useCustomShift}
              onChange={(e) => setUseCustomShift(e.target.checked)}
            />
            <span>Thêm một ca tùy chỉnh khác</span>
          </label>

          {useCustomShift && (
            <CustomTimeBox style={{ marginTop: "0.8rem" }}>
              <span>Từ:</span>
              <input
                type="time"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
              <span>Đến:</span>
              <input
                type="time"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </CustomTimeBox>
          )}
        </div>
      </Section>

      {/* 4. Tóm tắt kết quả */}
      {shiftsToCreate.length > 0 && selectedDoctor && (
        <SummaryBox>
          <div className="info">
            <span className="count">
              ✨ Tổng cộng: {shiftsToCreate.length} ca làm việc sẽ được tạo
            </span>
            <span className="desc">
              Áp dụng cho Bác sĩ <strong>{doctorObj?.name || ""}</strong> trên{" "}
              {selectedDays.length} ngày trong tuần. Tự động bỏ qua ca trùng giờ nếu có.
            </span>
          </div>
        </SummaryBox>
      )}

      {/* 5. Nút bấm */}
      <ActionsRow>
        <Button
          type="button"
          className="secondary"
          onClick={() => onCloseModal?.()}
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          className="primary"
          disabled={isBatchCreating || shiftsToCreate.length === 0}
        >
          {isBatchCreating
            ? "Đang tạo ca làm việc..."
            : `Đăng ký ${shiftsToCreate.length > 0 ? shiftsToCreate.length : ""} ca làm việc`}
        </Button>
      </ActionsRow>
    </FormContainer>
  );
}

export default BatchCreateShiftForm;
