import React, { useState } from "react";
import styled from "styled-components";
import {
  HiCheckCircle,
  HiExclamationTriangle,
  HiXCircle,
  HiOutlineSparkles,
  HiInformationCircle,
} from "react-icons/hi2";

export const TOOTH_STATUSES = {
  healthy: { label: "Bình thường", color: "#10B981", bg: "#ECFDF5", code: "HT" },
  cavity: { label: "Sâu răng", color: "#EF4444", bg: "#FEF2F2", code: "CR" },
  filled: { label: "Đã trám", color: "#3B82F6", bg: "#EFF6FF", code: "FL" },
  root_canal: { label: "Điều trị tủy", color: "#8B5CF6", bg: "#F5F3FF", code: "RC" },
  crown: { label: "Bọc răng sứ", color: "#F59E0B", bg: "#FFFBEB", code: "CRW" },
  missing: { label: "Mất răng", color: "#6B7280", bg: "#F3F4F6", code: "MS" },
  implant: { label: "Cấy Implant", color: "#06B6D4", bg: "#ECFEFF", code: "IMP" },
  impacted: { label: "Mọc lệch/ngầm", color: "#F97316", bg: "#FFF7ED", code: "IMPCT" },
  bridge: { label: "Cầu răng", color: "#14B8A6", bg: "#F0FDFA", code: "BRG" },
  orthodontic: { label: "Chỉnh nha", color: "#EC4899", bg: "#FDF2F8", code: "ORT" },
};

const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

const OdontogramWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  background: var(--color-grey-50, #f9fafb);
  padding: 1.8rem;
  border-radius: 1.2rem;
  border: 1px solid var(--color-grey-200, #e5e7eb);
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem;
  background: var(--color-grey-0, #ffffff);
  padding: 1rem 1.4rem;
  border-radius: 0.8rem;
  border: 1px solid var(--color-grey-200, #e5e7eb);
`;

const ToolLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700, #374151);
  margin-right: 0.4rem;
`;

const ToolBtn = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 600;
  border: 2px solid ${(props) => (props.$active ? props.$color : "transparent")};
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  background: var(--color-grey-0, #ffffff);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--color-grey-200, #e5e7eb);
  overflow-x: auto;
`;

const ArchRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  position: relative;
`;

const Quadrant = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const Divider = styled.div`
  width: 2px;
  height: 90px;
  background-color: var(--color-grey-300, #d1d5db);
  margin: 0 0.5rem;
`;

const HorizontalSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1px;
  background-color: var(--color-grey-200, #e5e7eb);
  margin: 0.4rem 0;
  position: relative;

  &::after {
    content: "ĐƯỜNG CẮN KHỚP GIỮA HÀM TRÊN & HÀM DƯỚI";
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--color-grey-400, #9ca3af);
    background-color: var(--color-grey-0, #ffffff);
    padding: 0 1rem;
  }
`;

const ToothBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 0.6rem;
  transition: all 0.15s ease;
  border: 2px solid
    ${(props) => (props.$selected ? "var(--color-brand-600, #4f46e5)" : "transparent")};
  background-color: ${(props) =>
    props.$selected ? "var(--color-brand-50, #eef2ff)" : "transparent"};

  &:hover {
    background-color: var(--color-grey-100, #f3f4f6);
    transform: scale(1.05);
  }
`;

const ToothNumber = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(props) => (props.$isAbnormal ? props.$color : "var(--color-grey-600, #4b5563)")};
`;

const ToothStatusPill = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 0.4rem;
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  white-space: nowrap;
`;

const LegendRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding-top: 0.8rem;
  border-top: 1px dashed var(--color-grey-200, #e5e7eb);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.15rem;
  color: var(--color-grey-600, #4b5563);
`;

const LegendColorDot = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

const DetailInspector = styled.div`
  background: var(--color-grey-0, #ffffff);
  border: 1px solid var(--color-brand-500, #6366f1);
  border-radius: 1rem;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.1);
`;

const InspectorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InspectorTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-grey-800, #1f2937);
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const SurfaceSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SurfaceCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--color-grey-700, #374151);
  cursor: pointer;
`;

// Thành phần đồ họa SVG mô phỏng răng nha khoa với 5 mặt (O, M, D, B, L)
function ToothGraphic({ tooth, isSelected }) {
  const statusInfo = TOOTH_STATUSES[tooth?.status] || TOOTH_STATUSES.healthy;
  const isHealthy = tooth?.status === "healthy" || !tooth?.status;
  const fillColor = statusInfo.color;

  const hasSurface = (s) => (tooth?.surfaces || []).includes(s);

  // Tô màu các mặt răng nếu có chỉ định cụ thể mặt bị bệnh, hoặc tô toàn bộ răng
  const getSurfaceColor = (surfaceName) => {
    if (tooth?.status === "missing") return "#9CA3AF";
    if (isHealthy) return "#F9FAFB";
    if (hasSurface(surfaceName)) return fillColor;
    return tooth?.surfaces && tooth.surfaces.length > 0 ? "#F9FAFB" : fillColor;
  };

  return (
    <svg width="40" height="46" viewBox="0 0 40 46">
      {/* Thân ngoài răng */}
      <rect
        x="2"
        y="2"
        width="36"
        height="42"
        rx="6"
        fill="#FFFFFF"
        stroke={isSelected ? "#4F46E5" : "#D1D5DB"}
        strokeWidth={isSelected ? "2.5" : "1.5"}
      />

      {tooth?.status === "missing" ? (
        // Dấu X khi răng đã mất
        <g stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
          <line x1="8" y1="8" x2="32" y2="38" />
          <line x1="32" y1="8" x2="8" y2="38" />
        </g>
      ) : tooth?.status === "implant" ? (
        // Biểu tượng trụ Implant
        <g fill="#06B6D4">
          <circle cx="20" cy="14" r="7" fill="#0891B2" opacity="0.3" />
          <rect x="16" y="10" width="8" height="8" rx="2" fill="#06B6D4" />
          <path d="M15 22 L25 22 L23 38 L17 38 Z" fill="#0E7490" />
          <line x1="14" y1="26" x2="26" y2="26" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="15" y1="31" x2="25" y2="31" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>
      ) : (
        // 5 mặt răng tiêu chuẩn nha khoa: Buccal (trên), Lingual (dưới), Mesial (trái), Distal (phải), Occlusal (tâm)
        <g>
          {/* Top surface (Buccal/Ngoài) */}
          <polygon
            points="6,6 34,6 26,14 14,14"
            fill={getSurfaceColor("B")}
            stroke="#9CA3AF"
            strokeWidth="0.8"
          />
          {/* Bottom surface (Lingual/Trong) */}
          <polygon
            points="14,32 26,32 34,40 6,40"
            fill={getSurfaceColor("L")}
            stroke="#9CA3AF"
            strokeWidth="0.8"
          />
          {/* Left surface (Mesial/Gần) */}
          <polygon
            points="6,6 14,14 14,32 6,40"
            fill={getSurfaceColor("M")}
            stroke="#9CA3AF"
            strokeWidth="0.8"
          />
          {/* Right surface (Distal/Xa) */}
          <polygon
            points="34,6 34,40 26,32 26,14"
            fill={getSurfaceColor("D")}
            stroke="#9CA3AF"
            strokeWidth="0.8"
          />
          {/* Center surface (Occlusal/Mặt nhai) */}
          <rect
            x="14"
            y="14"
            width="12"
            height="18"
            fill={getSurfaceColor("O")}
            stroke="#9CA3AF"
            strokeWidth="0.8"
          />
        </g>
      )}
    </svg>
  );
}

export default function InteractiveOdontogram({
  dentalChart = [],
  onUpdateTooth,
  onBatchUpdate,
}) {
  const [activeTool, setActiveTool] = useState("cavity");
  const [selectedToothNum, setSelectedToothNum] = useState(null);
  const [selectedSurfaces, setSelectedSurfaces] = useState([]);
  const [toothNotes, setToothNotes] = useState("");

  const chartMap = new Map((dentalChart || []).map((t) => [t.toothNumber, t]));

  const handleToothClick = (toothNum) => {
    const currentTooth = chartMap.get(toothNum) || {
      toothNumber: toothNum,
      status: "healthy",
      surfaces: [],
      notes: "",
    };

    setSelectedToothNum(toothNum);
    setSelectedSurfaces(currentTooth.surfaces || []);
    setToothNotes(currentTooth.notes || "");

    // Nếu đang chọn công cụ nhanh và click vào răng, gán luôn trạng thái đó
    if (activeTool && onUpdateTooth) {
      onUpdateTooth({
        toothNumber: toothNum,
        status: activeTool,
        surfaces: currentTooth.surfaces || [],
        notes: currentTooth.notes || "",
      });
    }
  };

  const handleApplyInspector = (newStatus) => {
    if (!selectedToothNum || !onUpdateTooth) return;
    onUpdateTooth({
      toothNumber: selectedToothNum,
      status: newStatus || activeTool,
      surfaces: selectedSurfaces,
      notes: toothNotes,
    });
  };

  const toggleSurface = (surfaceCode) => {
    setSelectedSurfaces((prev) => {
      const next = prev.includes(surfaceCode)
        ? prev.filter((s) => s !== surfaceCode)
        : [...prev, surfaceCode];

      if (selectedToothNum && onUpdateTooth) {
        const current = chartMap.get(selectedToothNum);
        onUpdateTooth({
          toothNumber: selectedToothNum,
          status: current?.status || "cavity",
          surfaces: next,
          notes: toothNotes,
        });
      }
      return next;
    });
  };

  const selectedToothDoc = selectedToothNum ? chartMap.get(selectedToothNum) : null;
  const selectedStatusInfo =
    TOOTH_STATUSES[selectedToothDoc?.status] || TOOTH_STATUSES.healthy;

  return (
    <OdontogramWrapper>
      {/* Thanh công cụ chọn nhanh trạng thái */}
      <Toolbar>
        <ToolLabel>Bút chọn nhanh:</ToolLabel>
        {Object.entries(TOOTH_STATUSES).map(([key, val]) => (
          <ToolBtn
            key={key}
            type="button"
            $active={activeTool === key}
            $color={val.color}
            $bg={val.bg}
            onClick={() => setActiveTool(key)}
          >
            {val.label}
          </ToolBtn>
        ))}
      </Toolbar>

      {/* Sơ đồ 32 răng chuẩn FDI */}
      <ChartContainer>
        {/* HÀM TRÊN (Maxilla) */}
        <ArchRow>
          <Quadrant>
            {UPPER_RIGHT.map((num) => {
              const t = chartMap.get(num) || { toothNumber: num, status: "healthy" };
              const s = TOOTH_STATUSES[t.status] || TOOTH_STATUSES.healthy;
              return (
                <ToothBox
                  key={num}
                  $selected={selectedToothNum === num}
                  onClick={() => handleToothClick(num)}
                  title={`Răng ${num}: ${s.label}`}
                >
                  <ToothNumber
                    $isAbnormal={t.status !== "healthy"}
                    $color={s.color}
                  >
                    {num}
                  </ToothNumber>
                  <ToothGraphic tooth={t} isSelected={selectedToothNum === num} />
                  {t.status !== "healthy" && (
                    <ToothStatusPill $color={s.color} $bg={s.bg}>
                      {s.code}
                    </ToothStatusPill>
                  )}
                </ToothBox>
              );
            })}
          </Quadrant>

          <Divider />

          <Quadrant>
            {UPPER_LEFT.map((num) => {
              const t = chartMap.get(num) || { toothNumber: num, status: "healthy" };
              const s = TOOTH_STATUSES[t.status] || TOOTH_STATUSES.healthy;
              return (
                <ToothBox
                  key={num}
                  $selected={selectedToothNum === num}
                  onClick={() => handleToothClick(num)}
                  title={`Răng ${num}: ${s.label}`}
                >
                  <ToothNumber
                    $isAbnormal={t.status !== "healthy"}
                    $color={s.color}
                  >
                    {num}
                  </ToothNumber>
                  <ToothGraphic tooth={t} isSelected={selectedToothNum === num} />
                  {t.status !== "healthy" && (
                    <ToothStatusPill $color={s.color} $bg={s.bg}>
                      {s.code}
                    </ToothStatusPill>
                  )}
                </ToothBox>
              );
            })}
          </Quadrant>
        </ArchRow>

        <HorizontalSeparator />

        {/* HÀM DƯỚI (Mandible) */}
        <ArchRow>
          <Quadrant>
            {LOWER_RIGHT.map((num) => {
              const t = chartMap.get(num) || { toothNumber: num, status: "healthy" };
              const s = TOOTH_STATUSES[t.status] || TOOTH_STATUSES.healthy;
              return (
                <ToothBox
                  key={num}
                  $selected={selectedToothNum === num}
                  onClick={() => handleToothClick(num)}
                  title={`Răng ${num}: ${s.label}`}
                >
                  {t.status !== "healthy" && (
                    <ToothStatusPill $color={s.color} $bg={s.bg}>
                      {s.code}
                    </ToothStatusPill>
                  )}
                  <ToothGraphic tooth={t} isSelected={selectedToothNum === num} />
                  <ToothNumber
                    $isAbnormal={t.status !== "healthy"}
                    $color={s.color}
                  >
                    {num}
                  </ToothNumber>
                </ToothBox>
              );
            })}
          </Quadrant>

          <Divider />

          <Quadrant>
            {LOWER_LEFT.map((num) => {
              const t = chartMap.get(num) || { toothNumber: num, status: "healthy" };
              const s = TOOTH_STATUSES[t.status] || TOOTH_STATUSES.healthy;
              return (
                <ToothBox
                  key={num}
                  $selected={selectedToothNum === num}
                  onClick={() => handleToothClick(num)}
                  title={`Răng ${num}: ${s.label}`}
                >
                  {t.status !== "healthy" && (
                    <ToothStatusPill $color={s.color} $bg={s.bg}>
                      {s.code}
                    </ToothStatusPill>
                  )}
                  <ToothGraphic tooth={t} isSelected={selectedToothNum === num} />
                  <ToothNumber
                    $isAbnormal={t.status !== "healthy"}
                    $color={s.color}
                  >
                    {num}
                  </ToothNumber>
                </ToothBox>
              );
            })}
          </Quadrant>
        </ArchRow>

        {/* Chú giải trạng thái */}
        <LegendRow>
          {Object.entries(TOOTH_STATUSES).map(([key, val]) => (
            <LegendItem key={key}>
              <LegendColorDot $color={val.color} />
              <span>{val.label}</span>
            </LegendItem>
          ))}
        </LegendRow>
      </ChartContainer>

      {/* Bảng điều khiển chi tiết răng được chọn (Inspector) */}
      {selectedToothNum && (
        <DetailInspector>
          <InspectorHeader>
            <InspectorTitle>
              <span>Chi tiết Răng số #{selectedToothNum}</span>
              <ToothStatusPill
                $color={selectedStatusInfo.color}
                $bg={selectedStatusInfo.bg}
              >
                {selectedStatusInfo.label}
              </ToothStatusPill>
            </InspectorTitle>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-grey-500)",
                fontSize: "1.4rem",
              }}
              onClick={() => setSelectedToothNum(null)}
            >
              ✕ Đóng
            </button>
          </InspectorHeader>

          {/* Chọn mặt răng bị tổn thương (M, D, O, B, L) */}
          <div>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "var(--color-grey-600)",
                marginBottom: "0.6rem",
              }}
            >
              Chọn mặt răng can thiệp (Surfaces):
            </div>
            <SurfaceSelector>
              {[
                { code: "O", name: "Mặt nhai (Occlusal)" },
                { code: "M", name: "Mặt gần (Mesial)" },
                { code: "D", name: "Mặt xa (Distal)" },
                { code: "B", name: "Mặt ngoài (Buccal)" },
                { code: "L", name: "Mặt trong (Lingual)" },
              ].map((sf) => (
                <SurfaceCheckbox key={sf.code}>
                  <input
                    type="checkbox"
                    checked={selectedSurfaces.includes(sf.code)}
                    onChange={() => toggleSurface(sf.code)}
                  />
                  <span>{sf.name}</span>
                </SurfaceCheckbox>
              ))}
            </SurfaceSelector>
          </div>

          {/* Ghi chú răng */}
          <div>
            <input
              type="text"
              placeholder="Ghi chú chi tiết cho răng này (VD: nứt men nhẹ, chân răng vẹo...)"
              value={toothNotes}
              onChange={(e) => setToothNotes(e.target.value)}
              onBlur={() => handleApplyInspector(selectedToothDoc?.status)}
              style={{
                width: "100%",
                padding: "0.8rem 1.2rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--color-grey-300)",
                fontSize: "1.3rem",
              }}
            />
          </div>

          {/* Các nút chuyển trạng thái nhanh */}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {Object.entries(TOOTH_STATUSES).map(([stKey, stVal]) => (
              <button
                key={stKey}
                type="button"
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "0.6rem",
                  border: `1px solid ${stVal.color}`,
                  backgroundColor:
                    selectedToothDoc?.status === stKey ? stVal.color : stVal.bg,
                  color:
                    selectedToothDoc?.status === stKey ? "#ffffff" : stVal.color,
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
                onClick={() => handleApplyInspector(stKey)}
              >
                {stVal.label}
              </button>
            ))}
          </div>
        </DetailInspector>
      )}
    </OdontogramWrapper>
  );
}
