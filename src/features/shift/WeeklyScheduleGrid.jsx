import { useState } from "react";
import styled from "styled-components";
import {
  Trash2,
  Clock,
  GripVertical,
  Plus,
  Users,
  Move,
  X,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Check
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useDeleteShift } from "./useDeleteShift";
import { useEditShift } from "./useEditShift";
import { useCreateShift } from "./useCreateShift";
import { useEmployees } from "../employee/useEmployees";
import Button from "../../components/admin/Button";
import Input from "../../components/admin/Input";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
`;

// Guide Banner
const InstructionBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(56, 189, 248, 0.12) 100%);
  border: 1px solid rgba(2, 132, 199, 0.2);
  border-radius: var(--border-radius-md);
  font-size: 1.3rem;
  color: var(--color-grey-700);

  .guide-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--color-brand-600);
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: 700;
      padding: 0.2rem 0.8rem;
      border-radius: var(--border-radius-sm);
    }
  }
`;

// Doctor Pool / Quick Assign Bar
const DoctorPoolWrapper = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 1.4rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const DoctorPoolHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .title-group {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    h4 {
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--color-grey-800);
      margin: 0;
    }

    span {
      font-size: 1.2rem;
      color: var(--color-grey-400);
    }
  }

  .toggle-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-brand-600);
    font-size: 1.25rem;
    font-weight: 600;

    &:hover {
      color: var(--color-brand-700);
    }
  }
`;

const DoctorList = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.6rem;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: 4px;
  }
`;

const DoctorCard = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 1.2rem;
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  cursor: grab;
  user-select: none;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    border-color: var(--color-brand-400);
    background: var(--color-brand-50);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    cursor: grabbing;
  }

  .doc-avatar {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    background: var(--color-brand-gradient);
    color: white;
    font-weight: 700;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .doc-info {
    display: flex;
    flex-direction: column;

    .doc-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--color-grey-800);
      white-space: nowrap;
    }

    .doc-specialty {
      font-size: 1.15rem;
      color: var(--color-grey-400);
      white-space: nowrap;
    }
  }

  .drag-icon {
    color: var(--color-grey-400);
  }
`;

// Weekly Grid
const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  overflow-x: auto;
  padding: 0.4rem 0.8rem 1.6rem 0.4rem;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-brand-400);
  }
`;

const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(14.5rem, 1fr));
  gap: 1.2rem;
  width: 100%;
  box-sizing: border-box;
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  min-width: 0;
  box-sizing: border-box;
  background: ${(props) =>
    props.$isOver
      ? "rgba(2, 132, 199, 0.08)"
      : "var(--color-grey-50)"};
  border: 2px ${(props) => (props.$isOver ? "dashed var(--color-brand-500)" : "solid var(--color-grey-200)")};
  border-radius: var(--border-radius-lg);
  padding: 1.2rem;
  min-height: 52rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${(props) => (props.$isOver ? "scale(1.01)" : "none")};
  box-shadow: ${(props) =>
    props.$isOver ? "0 0 16px rgba(2, 132, 199, 0.2)" : "none"};
`;

const ColumnHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid var(--color-grey-200);

  .day-label {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-800);
    white-space: nowrap;
  }

  .shift-count {
    font-size: 1.15rem;
    color: var(--color-brand-600);
    font-weight: 600;
    white-space: nowrap;
  }
`;

const DropZoneIndicator = styled.div`
  padding: 1.2rem;
  border: 2px dashed var(--color-brand-400);
  border-radius: var(--border-radius-md);
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
`;

const ShiftCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  position: relative;
  cursor: grab;
  user-select: none;
  opacity: ${(props) => (props.$isDragging ? 0.4 : 1)};
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-brand-400);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }
`;

const ShiftCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;

  .left-group {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    min-width: 0;
  }

  .time-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-brand-700);
    background: var(--color-brand-50);
    padding: 0.25rem 0.6rem;
    border-radius: var(--border-radius-full);
    white-space: nowrap;
  }

  .drag-handle {
    color: var(--color-grey-400);
    cursor: grab;
    display: flex;
    align-items: center;
  }

  .delete-btn {
    background: transparent;
    border: none;
    color: var(--color-grey-400);
    cursor: pointer;
    padding: 0.3rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
      color: #ef4444;
      background: var(--color-red-100);
    }
  }
`;

const DoctorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 0;

  .avatar {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    background: var(--color-brand-gradient);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;

    .name {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--color-grey-800);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .service {
      font-size: 1.15rem;
      color: var(--color-grey-400);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const StatusBadge = styled.span`
  align-self: flex-start;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius-sm);
  background: ${(props) =>
    props.$booked ? "var(--color-yellow-100)" : "var(--color-green-100)"};
  color: ${(props) =>
    props.$booked ? "var(--color-yellow-700)" : "var(--color-green-700)"};
`;

const EmptyColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: var(--color-grey-400);
  font-size: 1.25rem;
  text-align: center;
  gap: 0.8rem;
  border: 1px dashed var(--color-grey-200);
  border-radius: var(--border-radius-md);
  margin-top: 1rem;
`;

// Quick Assign Modal Overlay
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.6rem;
`;

const QuickAssignCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 48rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: scaleIn 0.2s ease-out;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  .doc-title {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    .avatar-large {
      width: 4.4rem;
      height: 4.4rem;
      border-radius: 50%;
      background: var(--color-brand-gradient);
      color: white;
      font-size: 1.6rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h3 {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--color-grey-800);
      margin: 0;
    }

    p {
      font-size: 1.3rem;
      color: var(--color-grey-400);
      margin: 0;
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--color-grey-400);
    cursor: pointer;
    padding: 0.4rem;
    border-radius: 50%;

    &:hover {
      color: var(--color-grey-700);
      background: var(--color-grey-100);
    }
  }
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const PresetButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.2rem;
  background: ${(props) =>
    props.$selected ? "var(--color-brand-50)" : "var(--color-grey-50)"};
  border: 1.5px solid ${(props) =>
    props.$selected ? "var(--color-brand-500)" : "var(--color-grey-200)"};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: var(--color-brand-400);
    background: var(--color-brand-50);
  }

  .label {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--color-grey-800);
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .time {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-brand-600);
    margin-top: 0.3rem;
  }
`;

const DAYS = [
  { key: "Monday", label: "Thứ Hai", short: "T2" },
  { key: "Tuesday", label: "Thứ Ba", short: "T3" },
  { key: "Wednesday", label: "Thứ Tư", short: "T4" },
  { key: "Thursday", label: "Thứ Năm", short: "T5" },
  { key: "Friday", label: "Thứ Sáu", short: "T6" },
  { key: "Saturday", label: "Thứ Bảy", short: "T7" },
  { key: "Sunday", label: "Chủ Nhật", short: "CN" },
];

const SHIFT_PRESETS = [
  { id: "morning", label: "Ca Sáng", time: "08:00 - 12:00", start: "08:00", end: "12:00" },
  { id: "afternoon", label: "Ca Chiều", time: "13:30 - 17:30", start: "13:30", end: "17:30" },
  { id: "fullday", label: "Cả Ngày", time: "08:00 - 17:00", start: "08:00", end: "17:00" },
  { id: "evening", label: "Ca Tối", time: "17:30 - 20:30", start: "17:30", end: "20:30" },
];

function WeeklyScheduleGrid({ shifts = [] }) {
  const { deleteShift, isDeleting } = useDeleteShift();
  const { editShift, isEditing } = useEditShift();
  const { createShift, isCreating } = useCreateShift();
  const { employees = [] } = useEmployees();

  const [showDoctorPool, setShowDoctorPool] = useState(true);
  const [activeOverDay, setActiveOverDay] = useState(null);
  const [draggingShiftId, setDraggingShiftId] = useState(null);

  // Quick Assign Modal state
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    doctor: null,
    dayKey: "Monday",
    dayLabel: "Thứ Hai",
    selectedPreset: "morning",
    customStart: "08:00",
    customEnd: "12:00",
  });

  const getDayShifts = (dayKey) => {
    return shifts
      .filter((s) => s.DayOfWeek?.toLowerCase() === dayKey.toLowerCase())
      .sort((a, b) => (a.StartTime || "").localeCompare(b.StartTime || ""));
  };

  const handleDelete = (shiftId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ca làm việc này?")) {
      deleteShift(shiftId);
    }
  };

  // --- DRAG HANDLERS FOR SHIFTS ---
  const handleShiftDragStart = (e, shift) => {
    setDraggingShiftId(shift._id);
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "SHIFT",
        shiftId: shift._id,
        sourceDay: shift.DayOfWeek,
        doctorName: shift.employee?.name || "Bác sĩ",
      })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleShiftDragEnd = () => {
    setDraggingShiftId(null);
    setActiveOverDay(null);
  };

  // --- DRAG HANDLERS FOR DOCTORS ---
  const handleDoctorDragStart = (e, doctor) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "DOCTOR",
        doctorId: doctor._id,
        doctorName: doctor.name,
        specialty: doctor.service?.nameService || "Bác sĩ",
      })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  // --- DROP TARGET HANDLERS FOR DAY COLUMNS ---
  const handleDragOver = (e, dayKey) => {
    e.preventDefault();
    if (activeOverDay !== dayKey) {
      setActiveOverDay(dayKey);
    }
  };

  const handleDragLeave = (e, dayKey) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (activeOverDay === dayKey) {
      setActiveOverDay(null);
    }
  };

  const handleDrop = (e, targetDayKey, targetDayLabel) => {
    e.preventDefault();
    setActiveOverDay(null);
    setDraggingShiftId(null);

    const rawData = e.dataTransfer.getData("application/json");
    if (!rawData) return;

    try {
      const data = JSON.parse(rawData);

      // Case 1: Dragging a shift to another day
      if (data.type === "SHIFT") {
        if (data.sourceDay?.toLowerCase() === targetDayKey.toLowerCase()) {
          return;
        }

        editShift(
          {
            newShiftData: { DayOfWeek: targetDayKey },
            id: data.shiftId,
          },
          {
            onSuccess: () => {
              toast.success(
                `Đã chuyển ca trực của ${data.doctorName} sang ${targetDayLabel}!`
              );
            },
          }
        );
      }

      // Case 2: Dragging a Doctor to a day -> Quick Assign Modal
      if (data.type === "DOCTOR") {
        setAssignModal({
          isOpen: true,
          doctor: {
            id: data.doctorId,
            name: data.doctorName,
            specialty: data.specialty,
          },
          dayKey: targetDayKey,
          dayLabel: targetDayLabel,
          selectedPreset: "morning",
          customStart: "08:00",
          customEnd: "12:00",
        });
      }
    } catch (err) {
      console.error("Drag and drop parse error:", err);
    }
  };

  // Quick assign submission
  const handleConfirmAssign = () => {
    const preset = SHIFT_PRESETS.find((p) => p.id === assignModal.selectedPreset);
    const startTime = preset ? preset.start : assignModal.customStart;
    const endTime = preset ? preset.end : assignModal.customEnd;

    createShift(
      {
        employee: assignModal.doctor.id,
        DayOfWeek: assignModal.dayKey,
        StartTime: startTime,
        EndTime: endTime,
        isBooked: false,
      },
      {
        onSuccess: () => {
          toast.success(
            `Đã tạo ca trực cho ${assignModal.doctor.name} vào ${assignModal.dayLabel} (${startTime} - ${endTime})!`
          );
          setAssignModal((prev) => ({ ...prev, isOpen: false }));
        },
      }
    );
  };

  return (
    <Container>
      {/* Instruction Banner */}
      <InstructionBanner>
        <div className="guide-content">
          <span className="badge">
            <Move size={12} /> Kéo & Thả
          </span>
          <span>
            Kéo thả thẻ ca trực giữa các cột thứ để dời ngày làm việc, hoặc kéo bác sĩ từ danh sách bên dưới vào ngày cần phân công để tạo ca siêu nhanh.
          </span>
        </div>
      </InstructionBanner>

      {/* Draggable Doctor Pool */}
      <DoctorPoolWrapper>
        <DoctorPoolHeader>
          <div className="title-group">
            <Users size={18} color="var(--color-brand-600)" />
            <h4>Danh sách Bác sĩ sẵn sàng</h4>
            <span>(Kéo bác sĩ thả vào ngày bất kỳ để tạo ca trực tức thì)</span>
          </div>

          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowDoctorPool(!showDoctorPool)}
          >
            {showDoctorPool ? (
              <>
                <span>Thu gọn</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>Mở rộng ({employees.length})</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </DoctorPoolHeader>

        {showDoctorPool && (
          <DoctorList>
            {employees.length === 0 ? (
              <span style={{ fontSize: "1.3rem", color: "var(--color-grey-400)", padding: "0.4rem" }}>
                Chưa có dữ liệu bác sĩ
              </span>
            ) : (
              employees.map((doc) => {
                const initial = (doc.name || "B")[0].toUpperCase();
                return (
                  <DoctorCard
                    key={doc._id}
                    draggable
                    onDragStart={(e) => handleDoctorDragStart(e, doc)}
                    title="Kéo bác sĩ này thả vào ngày trong tuần để tạo ca"
                  >
                    <GripVertical size={14} className="drag-icon" />
                    <div className="doc-avatar">{initial}</div>
                    <div className="doc-info">
                      <span className="doc-name">{doc.name}</span>
                      <span className="doc-specialty">
                        {doc.service?.nameService || "Nha khoa"}
                      </span>
                    </div>
                  </DoctorCard>
                );
              })
            )}
          </DoctorList>
        )}
      </DoctorPoolWrapper>

      {/* Weekly Schedule Columns */}
      <GridContainer>
        <DaysHeader>
          {DAYS.map((day) => {
            const dayShifts = getDayShifts(day.key);
            const isOver = activeOverDay === day.key;

            return (
              <DayColumn
                key={day.key}
                $isOver={isOver}
                onDragOver={(e) => handleDragOver(e, day.key)}
                onDragLeave={(e) => handleDragLeave(e, day.key)}
                onDrop={(e) => handleDrop(e, day.key, day.label)}
              >
                <ColumnHeader>
                  <span className="day-label">
                    {day.short} - {day.label}
                  </span>
                  <span className="shift-count">{dayShifts.length} ca trực</span>
                </ColumnHeader>

                {isOver && (
                  <DropZoneIndicator>
                    <Plus size={16} />
                    <span>Thả vào đây</span>
                  </DropZoneIndicator>
                )}

                {dayShifts.length === 0 && !isOver ? (
                  <EmptyColumn>
                    <Clock size={22} color="var(--color-grey-300)" />
                    <span>Chưa có ca trực</span>
                    <span style={{ fontSize: "1.1rem", color: "var(--color-brand-600)" }}>
                      Kéo bác sĩ vào đây
                    </span>
                  </EmptyColumn>
                ) : (
                  dayShifts.map((shift) => {
                    const initial = (shift.employee?.name || "B")[0].toUpperCase();
                    const isDragging = draggingShiftId === shift._id;

                    return (
                      <ShiftCard
                        key={shift._id}
                        draggable={!shift.isBooked && !isEditing}
                        $isDragging={isDragging}
                        onDragStart={(e) => handleShiftDragStart(e, shift)}
                        onDragEnd={handleShiftDragEnd}
                        title="Kéo thẻ này thả sang ngày khác để dời ca"
                      >
                        <ShiftCardHeader>
                          <div className="left-group">
                            <span className="drag-handle" title="Kéo để dời ngày">
                              <GripVertical size={13} />
                            </span>
                            <span className="time-badge">
                              <Clock size={11} />
                              {shift.StartTime} - {shift.EndTime}
                            </span>
                          </div>

                          <button
                            className="delete-btn"
                            title="Xóa ca này"
                            disabled={isDeleting}
                            onClick={() => handleDelete(shift._id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </ShiftCardHeader>

                        <DoctorInfo>
                          <div className="avatar">{initial}</div>
                          <div className="meta">
                            <span className="name">
                              {shift.employee?.name || "Bác sĩ"}
                            </span>
                            <span className="service">
                              {shift.employee?.service?.nameService || "Khám chung"}
                            </span>
                          </div>
                        </DoctorInfo>

                        <StatusBadge $booked={shift.isBooked}>
                          {shift.isBooked ? "Đã đặt lịch" : "Còn trống"}
                        </StatusBadge>
                      </ShiftCard>
                    );
                  })
                )}
              </DayColumn>
            );
          })}
        </DaysHeader>
      </GridContainer>

      {/* Quick Assign Modal */}
      {assignModal.isOpen && (
        <ModalOverlay onClick={() => setAssignModal((prev) => ({ ...prev, isOpen: false }))}>
          <QuickAssignCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div className="doc-title">
                <div className="avatar-large">
                  {(assignModal.doctor?.name || "B")[0].toUpperCase()}
                </div>
                <div>
                  <h3>Phân ca: {assignModal.doctor?.name}</h3>
                  <p>
                    Vào <strong>{assignModal.dayLabel}</strong> • Chuyên khoa: {assignModal.doctor?.specialty}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() => setAssignModal((prev) => ({ ...prev, isOpen: false }))}
              >
                <X size={18} />
              </button>
            </ModalHeader>

            <div>
              <label style={{ fontSize: "1.35rem", fontWeight: "600", color: "var(--color-grey-700)", marginBottom: "0.8rem", display: "block" }}>
                Chọn khung giờ ca trực (1 chạm):
              </label>
              <PresetGrid>
                {SHIFT_PRESETS.map((p) => {
                  const isSelected = assignModal.selectedPreset === p.id;
                  return (
                    <PresetButton
                      key={p.id}
                      type="button"
                      $selected={isSelected}
                      onClick={() => setAssignModal((prev) => ({ ...prev, selectedPreset: p.id }))}
                    >
                      <div className="label">
                        {isSelected && <Check size={14} color="var(--color-brand-600)" />}
                        <span>{p.label}</span>
                      </div>
                      <div className="time">{p.time}</div>
                    </PresetButton>
                  );
                })}
              </PresetGrid>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", borderTop: "1px solid var(--color-grey-100)", paddingTop: "1.6rem" }}>
              <Button
                type="button"
                variation="secondary"
                onClick={() => setAssignModal((prev) => ({ ...prev, isOpen: false }))}
                disabled={isCreating}
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                onClick={handleConfirmAssign}
                disabled={isCreating}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}
              >
                <Sparkles size={16} />
                <span>{isCreating ? "Đang tạo..." : "Xác nhận tạo ca"}</span>
              </Button>
            </div>
          </QuickAssignCard>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default WeeklyScheduleGrid;
