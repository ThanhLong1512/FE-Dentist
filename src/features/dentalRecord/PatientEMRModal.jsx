import React, { useState } from "react";
import styled from "styled-components";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlinePrinter,
  HiPlus,
  HiTrash,
  HiExclamationCircle,
  HiCheckCircle,
} from "react-icons/hi2";
import InteractiveOdontogram, { TOOTH_STATUSES } from "./InteractiveOdontogram";
import {
  useDentalRecord,
  useUpdateMedicalHistory,
  useUpdateTooth,
  useAddTreatmentSession,
  useDeleteTreatmentSession,
} from "./useDentalRecord";
import { useEmployees } from "../employee/useEmployees";
import { useServices } from "../services/useServices";
import Spinner from "../../components/admin/Spinner";
import { toast } from "react-toastify";

const ModalContainer = styled.div`
  width: 88vw;
  max-width: 1200px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: var(--color-grey-0, #ffffff);
  border-radius: 1.2rem;
  overflow: hidden;
`;

const PatientHeader = styled.div`
  padding: 1.8rem 2.4rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;
`;

const PatientTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  p {
    font-size: 1.3rem;
    color: #94a3b8;
    margin: 0;
  }
`;

const WarningBadgeGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const AlertBadge = styled.span`
  background: ${(props) => (props.$danger ? "#EF4444" : "#F59E0B")};
  color: #ffffff;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const TabsNav = styled.div`
  display: flex;
  background: var(--color-grey-100, #f3f4f6);
  border-bottom: 1px solid var(--color-grey-200, #e5e7eb);
  padding: 0 1.6rem;
  gap: 0.8rem;
`;

const TabButton = styled.button`
  padding: 1.2rem 1.8rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) =>
    props.$active ? "var(--color-brand-600, #4f46e5)" : "var(--color-grey-500, #6b7280)"};
  background: none;
  border: none;
  border-bottom: 3px solid
    ${(props) => (props.$active ? "var(--color-brand-600, #4f46e5)" : "transparent")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-brand-600, #4f46e5);
  }
`;

const TabContentArea = styled.div`
  padding: 2rem 2.4rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// Common card container
const SectionCard = styled.div`
  background: var(--color-grey-0, #ffffff);
  border: 1px solid var(--color-grey-200, #e5e7eb);
  border-radius: 1rem;
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-800, #1f2937);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  padding: 1rem;
  border-radius: 0.8rem;
  background-color: ${(props) => props.$bg || "#f8fafc"};
  border: 1px solid ${(props) => props.$border || "#e2e8f0"};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;

  span.number {
    font-size: 2rem;
    font-weight: 700;
    color: ${(props) => props.$color || "#1e293b"};
  }

  span.label {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--color-grey-600, #4b5563);
  }
`;

const TagSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const Chip = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  font-size: 1.3rem;
  font-weight: 500;
  border: 1px solid ${(props) => (props.$active ? "#EF4444" : "var(--color-grey-300)")};
  background-color: ${(props) =>
    props.$active ? "#FEF2F2" : "var(--color-grey-50)"};
  color: ${(props) => (props.$active ? "#DC2626" : "var(--color-grey-700)")};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #ef4444;
  }
`;

const ConditionChip = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  font-size: 1.3rem;
  font-weight: 500;
  border: 1px solid ${(props) => (props.$active ? "#F59E0B" : "var(--color-grey-300)")};
  background-color: ${(props) =>
    props.$active ? "#FFFBEB" : "var(--color-grey-50)"};
  color: ${(props) => (props.$active ? "#B45309" : "var(--color-grey-700)")};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #f59e0b;
  }
`;

const PrimaryBtn = styled.button`
  padding: 0.9rem 2rem;
  background: var(--color-brand-600, #4f46e5);
  color: white;
  font-weight: 600;
  font-size: 1.4rem;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s;

  &:hover {
    background: var(--color-brand-700, #4338ca);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Treatment Session timeline & cards
const SessionCard = styled.div`
  border: 1px solid var(--color-grey-200, #e5e7eb);
  border-radius: 0.8rem;
  padding: 1.6rem;
  background: var(--color-grey-50, #f9fafb);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-200, #e5e7eb);
  padding-bottom: 0.8rem;
`;

const DoctorName = styled.span`
  font-weight: 700;
  color: var(--color-blue-700, #1d4ed8);
  font-size: 1.4rem;
`;

const SessionDate = styled.span`
  color: var(--color-grey-500, #6b7280);
  font-size: 1.3rem;
  font-weight: 500;
`;

const ProcedureTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1.3rem;

  th,
  td {
    padding: 0.8rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--color-grey-200, #e5e7eb);
  }

  th {
    background-color: var(--color-grey-100, #f3f4f6);
    color: var(--color-grey-700, #374151);
    font-weight: 600;
  }
`;

const PrescriptionPaper = styled.div`
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 0.8rem;
  padding: 3rem;
  color: #1e293b;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  @media print {
    border: none;
    padding: 0;
    font-size: 12pt;
  }
`;

const COMMON_ALLERGIES = [
  "Penicillin",
  "Thuốc tê Lidocaine",
  "Thuốc tê Articaine",
  "Aspirin",
  "Ibuprofen",
  "Paracetamol",
  "Kháng sinh Cephalosporin",
  "Cao su Latex",
];

const COMMON_CONDITIONS = [
  "Tiểu đường (Diabetes)",
  "Tim mạch / Huyết áp cao",
  "Rối loạn đông máu",
  "Viêm gan B / C",
  "Hen phế quản (Asthma)",
  "Đang mang thai / Cho con bú",
  "Dạ dày / Trào ngược",
];

export default function PatientEMRModal({ patient = {}, onCloseModal }) {
  const [activeTab, setActiveTab] = useState("odontogram");
  const patientId = patient._id;

  const { record, isLoading: isLoadingRecord } = useDentalRecord(patientId);
  const { updateMedicalHistory, isUpdating: isUpdatingHistory } =
    useUpdateMedicalHistory();
  const { updateTooth } = useUpdateTooth();
  const { addSession, isAdding: isAddingSession } = useAddTreatmentSession();
  const { deleteSession } = useDeleteTreatmentSession();

  const { employees = [] } = useEmployees();
  const { services = [] } = useServices();

  // Local state for Anamnesis
  const [allergies, setAllergies] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [historyNotes, setHistoryNotes] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");
  const [customCondition, setCustomCondition] = useState("");

  // Sync loaded record to local state
  React.useEffect(() => {
    if (record?.medicalHistory) {
      setAllergies(record.medicalHistory.allergies || []);
      setConditions(record.medicalHistory.systemicConditions || []);
      setHistoryNotes(record.medicalHistory.notes || "");
    }
  }, [record]);

  // Local state for New Treatment Session Form
  const [sessionDoctor, setSessionDoctor] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [teethIntervened, setTeethIntervened] = useState("");
  const [procedurePrice, setProcedurePrice] = useState(0);

  // New Prescription Items inside current session form
  const [prescriptions, setPrescriptions] = useState([
    { drugName: "Amoxicillin 500mg", dosage: "1 viên", frequency: "2 lần/ngày sau ăn", duration: "5 ngày", instructions: "Uống đều đặn" }
  ]);

  if (isLoadingRecord) {
    return (
      <ModalContainer style={{ padding: "4rem", alignItems: "center" }}>
        <Spinner />
        <p style={{ marginTop: "1rem", fontSize: "1.4rem", color: "#6b7280" }}>
          Đang tải hồ sơ bệnh án nha khoa...
        </p>
      </ModalContainer>
    );
  }

  const chart = record?.dentalChart || [];
  const sessions = record?.treatmentSessions || [];

  // Summary counts
  const countByStatus = (st) => chart.filter((t) => t.status === st).length;

  const handleToggleAllergy = (name) => {
    setAllergies((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleToggleCondition = (name) => {
    setConditions((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleSaveMedicalHistory = () => {
    updateMedicalHistory({
      patientId,
      payload: {
        allergies,
        systemicConditions: conditions,
        notes: historyNotes,
      },
    });
  };

  const handleAddProcedureAndSession = (e) => {
    e.preventDefault();
    if (!diagnosis && !clinicalNotes && !selectedService) {
      toast.warning("Vui lòng nhập chẩn đoán hoặc chọn dịch vụ thực hiện");
      return;
    }

    const svcObj = services.find((s) => s._id === selectedService);

    const procedures = [];
    if (selectedService && svcObj) {
      const teethList = teethIntervened
        ? teethIntervened
            .split(/[\s,]+/)
            .map(Number)
            .filter(Boolean)
        : [];
      procedures.push({
        service: svcObj._id,
        serviceName: svcObj.nameService,
        teeth: teethList,
        price: procedurePrice || svcObj.priceDiscount || svcObj.priceService || 0,
        notes: `Can thiệp răng ${teethList.join(", ") || "toàn hàm"}`,
      });
    }

    addSession({
      patientId,
      sessionData: {
        sessionDate: new Date(),
        doctor: sessionDoctor || (employees[0]?._id ?? null),
        diagnosis,
        clinicalNotes,
        procedures,
        prescription: prescriptions.filter((p) => p.drugName.trim()),
      },
    });

    // Reset form
    setDiagnosis("");
    setClinicalNotes("");
    setSelectedService("");
    setTeethIntervened("");
    setProcedurePrice(0);
  };

  const addPrescriptionRow = () => {
    setPrescriptions((prev) => [
      ...prev,
      { drugName: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  };

  const removePrescriptionRow = (idx) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updatePrescriptionField = (idx, field, value) => {
    setPrescriptions((prev) => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  };

  const handlePrintPrescription = () => {
    window.print();
  };

  return (
    <ModalContainer>
      {/* 1. Header bệnh nhân & Cảnh báo an toàn y tế */}
      <PatientHeader>
        <PatientTitle>
          <h2>
            🦷 BỆNH ÁN NHA KHOA: {patient.name || "Bệnh nhân"}
          </h2>
          <p>
            Giới tính: {patient.gender === true ? "Nam" : "Nữ"} | Năm sinh:{" "}
            {patient.yearOfBirth} ({new Date().getFullYear() - (patient.yearOfBirth || 2000)} tuổi) | SĐT:{" "}
            {patient.phoneNumber} | Địa chỉ: {patient.address}
          </p>
        </PatientTitle>

        {/* Cảnh báo tiền sử bệnh lý nổi bật */}
        <WarningBadgeGroup>
          {allergies.length > 0 && (
            <AlertBadge $danger={true} title={allergies.join(", ")}>
              <HiExclamationCircle /> Dị ứng: {allergies.slice(0, 2).join(", ")}
              {allergies.length > 2 ? ` +${allergies.length - 2}` : ""}
            </AlertBadge>
          )}
          {conditions.length > 0 && (
            <AlertBadge $danger={false} title={conditions.join(", ")}>
              <HiExclamationCircle /> Bệnh lý: {conditions.slice(0, 2).join(", ")}
              {conditions.length > 2 ? ` +${conditions.length - 2}` : ""}
            </AlertBadge>
          )}
        </WarningBadgeGroup>
      </PatientHeader>

      {/* 2. Thanh Tabs */}
      <TabsNav>
        <TabButton
          type="button"
          $active={activeTab === "odontogram"}
          onClick={() => setActiveTab("odontogram")}
        >
          <HiOutlineClipboardDocumentList /> Sơ đồ răng (Odontogram)
        </TabButton>
        <TabButton
          type="button"
          $active={activeTab === "anamnesis"}
          onClick={() => setActiveTab("anamnesis")}
        >
          <HiOutlineHeart /> Tiền sử bệnh lý
        </TabButton>
        <TabButton
          type="button"
          $active={activeTab === "treatment"}
          onClick={() => setActiveTab("treatment")}
        >
          <HiOutlineClock /> Tiến trình điều trị ({sessions.length})
        </TabButton>
        <TabButton
          type="button"
          $active={activeTab === "prescription"}
          onClick={() => setActiveTab("prescription")}
        >
          <HiOutlineDocumentText /> Kê đơn & In toa thuốc
        </TabButton>
      </TabsNav>

      {/* 3. Nội dung Tab */}
      <TabContentArea>
        {/* TAB 1: SƠ ĐỒ RĂNG ODONTOGRAM */}
        {activeTab === "odontogram" && (
          <>
            <StatsGrid>
              <StatItem $color="#10B981" $bg="#ECFDF5" $border="#A7F3D0">
                <span className="number">{countByStatus("healthy")}</span>
                <span className="label">Răng tốt</span>
              </StatItem>
              <StatItem $color="#EF4444" $bg="#FEF2F2" $border="#FECACA">
                <span className="number">{countByStatus("cavity")}</span>
                <span className="label">Sâu răng</span>
              </StatItem>
              <StatItem $color="#3B82F6" $bg="#EFF6FF" $border="#BFDBFE">
                <span className="number">{countByStatus("filled")}</span>
                <span className="label">Đã trám</span>
              </StatItem>
              <StatItem $color="#8B5CF6" $bg="#F5F3FF" $border="#DDD6FE">
                <span className="number">{countByStatus("root_canal")}</span>
                <span className="label">Điều trị tủy</span>
              </StatItem>
              <StatItem $color="#F59E0B" $bg="#FFFBEB" $border="#FDE68A">
                <span className="number">{countByStatus("crown")}</span>
                <span className="label">Bọc răng sứ</span>
              </StatItem>
              <StatItem $color="#06B6D4" $bg="#ECFEFF" $border="#A5F3FC">
                <span className="number">{countByStatus("implant")}</span>
                <span className="label">Implant</span>
              </StatItem>
              <StatItem $color="#6B7280" $bg="#F3F4F6" $border="#E5E7EB">
                <span className="number">{countByStatus("missing")}</span>
                <span className="label">Mất răng</span>
              </StatItem>
            </StatsGrid>

            <InteractiveOdontogram
              dentalChart={chart}
              onUpdateTooth={(toothData) =>
                updateTooth({ patientId, toothData })
              }
            />
          </>
        )}

        {/* TAB 2: TIỀN SỬ BỆNH LÝ (ANAMNESIS) */}
        {activeTab === "anamnesis" && (
          <SectionCard>
            <SectionTitle>
              <HiOutlineHeart color="#EF4444" /> Tiền sử Bệnh lý & Cảnh báo Dị ứng
            </SectionTitle>

            <TagSelectorWrapper>
              <label style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                1. Dị ứng thuốc & Hóa chất (Bác sĩ cần lưu ý trước khi gây tê):
              </label>
              <ChipGroup>
                {COMMON_ALLERGIES.map((al) => (
                  <Chip
                    key={al}
                    type="button"
                    $active={allergies.includes(al)}
                    onClick={() => handleToggleAllergy(al)}
                  >
                    {allergies.includes(al) ? "✓ " : "+ "}
                    {al}
                  </Chip>
                ))}
              </ChipGroup>
              <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.4rem" }}>
                <input
                  type="text"
                  placeholder="Thêm dị ứng khác..."
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "0.6rem",
                    border: "1px solid var(--color-grey-300)",
                    fontSize: "1.3rem",
                  }}
                />
                <button
                  type="button"
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "0.6rem",
                    background: "var(--color-grey-200)",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (customAllergy.trim()) {
                      handleToggleAllergy(customAllergy.trim());
                      setCustomAllergy("");
                    }
                  }}
                >
                  Thêm
                </button>
              </div>
            </TagSelectorWrapper>

            <TagSelectorWrapper>
              <label style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                2. Bệnh lý toàn thân (Ảnh hưởng đến chỉ định phẫu thuật/nhổ răng):
              </label>
              <ChipGroup>
                {COMMON_CONDITIONS.map((cond) => (
                  <ConditionChip
                    key={cond}
                    type="button"
                    $active={conditions.includes(cond)}
                    onClick={() => handleToggleCondition(cond)}
                  >
                    {conditions.includes(cond) ? "✓ " : "+ "}
                    {cond}
                  </ConditionChip>
                ))}
              </ChipGroup>
              <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.4rem" }}>
                <input
                  type="text"
                  placeholder="Thêm bệnh lý khác..."
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "0.6rem",
                    border: "1px solid var(--color-grey-300)",
                    fontSize: "1.3rem",
                  }}
                />
                <button
                  type="button"
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "0.6rem",
                    background: "var(--color-grey-200)",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (customCondition.trim()) {
                      handleToggleCondition(customCondition.trim());
                      setCustomCondition("");
                    }
                  }}
                >
                  Thêm
                </button>
              </div>
            </TagSelectorWrapper>

            <div>
              <label
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "0.6rem",
                }}
              >
                3. Ghi chú bệnh sử đặc biệt:
              </label>
              <textarea
                rows={4}
                value={historyNotes}
                onChange={(e) => setHistoryNotes(e.target.value)}
                placeholder="Ghi chú thêm về thói quen nghiến răng, hút thuốc, tiền sử phẫu thuật hàm mặt..."
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "0.8rem",
                  border: "1px solid var(--color-grey-300)",
                  fontSize: "1.3rem",
                }}
              />
            </div>

            <PrimaryBtn
              type="button"
              disabled={isUpdatingHistory}
              onClick={handleSaveMedicalHistory}
            >
              {isUpdatingHistory ? "Đang lưu..." : "Lưu tiền sử bệnh lý"}
            </PrimaryBtn>
          </SectionCard>
        )}

        {/* TAB 3: TIẾN TRÌNH ĐIỀU TRỊ (TREATMENT SESSIONS) */}
        {activeTab === "treatment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Form ghi nhận lượt khám mới */}
            <SectionCard>
              <SectionTitle>
                <HiPlus /> Ghi nhận lượt điều trị mới
              </SectionTitle>
              <form
                onSubmit={handleAddProcedureAndSession}
                style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.4rem",
                  }}
                >
                  <div>
                    <label style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                      Bác sĩ điều trị:
                    </label>
                    <select
                      value={sessionDoctor}
                      onChange={(e) => setSessionDoctor(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        borderRadius: "0.6rem",
                        border: "1px solid var(--color-grey-300)",
                        marginTop: "0.4rem",
                      }}
                    >
                      <option value="">-- Chọn bác sĩ --</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.experience || "Bác sĩ"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                      Chẩn đoán (Diagnosis):
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Sâu ngà răng 36, Viêm lợi kẽ..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        borderRadius: "0.6rem",
                        border: "1px solid var(--color-grey-300)",
                        marginTop: "0.4rem",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: "1.4rem",
                  }}
                >
                  <div>
                    <label style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                      Thủ thuật / Dịch vụ nha khoa thực hiện:
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => {
                        setSelectedService(e.target.value);
                        const s = services.find((x) => x._id === e.target.value);
                        if (s)
                          setProcedurePrice(
                            s.priceDiscount || s.priceService || 0
                          );
                      }}
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        borderRadius: "0.6rem",
                        border: "1px solid var(--color-grey-300)",
                        marginTop: "0.4rem",
                      }}
                    >
                      <option value="">-- Chọn dịch vụ --</option>
                      {services.map((svc) => (
                        <option key={svc._id} value={svc._id}>
                          {svc.nameService} (
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(svc.priceDiscount || svc.priceService)}
                          )
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                      Vị trí răng can thiệp:
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 16, 26, 46"
                      value={teethIntervened}
                      onChange={(e) => setTeethIntervened(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        borderRadius: "0.6rem",
                        border: "1px solid var(--color-grey-300)",
                        marginTop: "0.4rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                      Đơn giá (VNĐ):
                    </label>
                    <input
                      type="number"
                      value={procedurePrice}
                      onChange={(e) => setProcedurePrice(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        borderRadius: "0.6rem",
                        border: "1px solid var(--color-grey-300)",
                        marginTop: "0.4rem",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                    Ghi chú lâm sàng (SOAP Notes / Tiến trình):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả kỹ thuật thực hiện, tình trạng chảy máu, vật liệu hàn, hẹn ngày tái khám..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "0.6rem",
                      border: "1px solid var(--color-grey-300)",
                      marginTop: "0.4rem",
                    }}
                  />
                </div>

                {/* Danh mục thuốc kê đơn trong ca khám */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.6rem",
                    }}
                  >
                    <label style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                      Kê đơn thuốc về nhà (tùy chọn):
                    </label>
                    <button
                      type="button"
                      onClick={addPrescriptionRow}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-brand-600)",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2rem",
                      }}
                    >
                      <HiPlus /> Thêm thuốc
                    </button>
                  </div>

                  {prescriptions.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1.5fr 1fr 2fr auto",
                        gap: "0.8rem",
                        alignItems: "center",
                        marginBottom: "0.6rem",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Tên thuốc"
                        value={p.drugName}
                        onChange={(e) =>
                          updatePrescriptionField(idx, "drugName", e.target.value)
                        }
                        style={{
                          padding: "0.6rem 0.8rem",
                          borderRadius: "0.4rem",
                          border: "1px solid var(--color-grey-300)",
                          fontSize: "1.25rem",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Liều lượng (VD: 1 viên)"
                        value={p.dosage}
                        onChange={(e) =>
                          updatePrescriptionField(idx, "dosage", e.target.value)
                        }
                        style={{
                          padding: "0.6rem 0.8rem",
                          borderRadius: "0.4rem",
                          border: "1px solid var(--color-grey-300)",
                          fontSize: "1.25rem",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Tần suất (2 lần/ngày)"
                        value={p.frequency}
                        onChange={(e) =>
                          updatePrescriptionField(idx, "frequency", e.target.value)
                        }
                        style={{
                          padding: "0.6rem 0.8rem",
                          borderRadius: "0.4rem",
                          border: "1px solid var(--color-grey-300)",
                          fontSize: "1.25rem",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Số ngày (5 ngày)"
                        value={p.duration}
                        onChange={(e) =>
                          updatePrescriptionField(idx, "duration", e.target.value)
                        }
                        style={{
                          padding: "0.6rem 0.8rem",
                          borderRadius: "0.4rem",
                          border: "1px solid var(--color-grey-300)",
                          fontSize: "1.25rem",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Lời dặn (uống sau ăn)"
                        value={p.instructions}
                        onChange={(e) =>
                          updatePrescriptionField(idx, "instructions", e.target.value)
                        }
                        style={{
                          padding: "0.6rem 0.8rem",
                          borderRadius: "0.4rem",
                          border: "1px solid var(--color-grey-300)",
                          fontSize: "1.25rem",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removePrescriptionRow(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#EF4444",
                          cursor: "pointer",
                        }}
                      >
                        <HiTrash />
                      </button>
                    </div>
                  ))}
                </div>

                <PrimaryBtn type="submit" disabled={isAddingSession}>
                  {isAddingSession ? "Đang lưu..." : "Lưu buổi điều trị"}
                </PrimaryBtn>
              </form>
            </SectionCard>

            {/* Lịch sử các ca khám trước */}
            <SectionCard>
              <SectionTitle>
                <HiOutlineClock /> Lịch sử các buổi khám ({sessions.length})
              </SectionTitle>

              {sessions.length === 0 ? (
                <p style={{ color: "var(--color-grey-500)", fontStyle: "italic" }}>
                  Chưa có lịch sử buổi khám nào được ghi nhận.
                </p>
              ) : (
                sessions.map((ss) => (
                  <SessionCard key={ss._id}>
                    <SessionHeader>
                      <div>
                        <DoctorName>
                          Bác sĩ: {ss.doctor?.name || "Bác sĩ phụ trách"}
                        </DoctorName>{" "}
                        - <SessionDate>{new Date(ss.sessionDate).toLocaleDateString("vi-VN")}</SessionDate>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          deleteSession({ patientId, sessionId: ss._id })
                        }
                        style={{
                          background: "none",
                          border: "none",
                          color: "#EF4444",
                          cursor: "pointer",
                          fontSize: "1.3rem",
                        }}
                        title="Xóa buổi khám này"
                      >
                        <HiTrash /> Xóa
                      </button>
                    </SessionHeader>

                    {ss.diagnosis && (
                      <div style={{ fontSize: "1.35rem" }}>
                        <strong>Chẩn đoán:</strong> {ss.diagnosis}
                      </div>
                    )}

                    {ss.procedures && ss.procedures.length > 0 && (
                      <ProcedureTable>
                        <thead>
                          <tr>
                            <th>Thủ thuật</th>
                            <th>Răng can thiệp</th>
                            <th>Đơn giá</th>
                            <th>Ghi chú</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ss.procedures.map((pr, pIdx) => (
                            <tr key={pIdx}>
                              <td>{pr.serviceName || pr.service?.nameService || "Thủ thuật"}</td>
                              <td>{pr.teeth?.join(", ") || "Toàn hàm"}</td>
                              <td>
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(pr.price || 0)}
                              </td>
                              <td>{pr.notes || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </ProcedureTable>
                    )}

                    {ss.clinicalNotes && (
                      <div
                        style={{
                          fontSize: "1.3rem",
                          background: "#ffffff",
                          padding: "1rem",
                          borderRadius: "0.6rem",
                          border: "1px solid var(--color-grey-200)",
                        }}
                      >
                        <strong>Ghi chú lâm sàng:</strong> {ss.clinicalNotes}
                      </div>
                    )}

                    {ss.prescription && ss.prescription.length > 0 && (
                      <div style={{ fontSize: "1.3rem" }}>
                        <strong>Đơn thuốc:</strong>
                        <ul style={{ paddingLeft: "2rem", marginTop: "0.4rem" }}>
                          {ss.prescription.map((rx, rIdx) => (
                            <li key={rIdx}>
                              <strong>{rx.drugName}</strong> ({rx.dosage}) -{" "}
                              {rx.frequency}, {rx.duration} ({rx.instructions})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </SessionCard>
                ))
              )}
            </SectionCard>
          </div>
        )}

        {/* TAB 4: KÊ ĐƠN & IN TOA THUỐC (PRESCRIPTIONS) */}
        {activeTab === "prescription" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <PrimaryBtn type="button" onClick={handlePrintPrescription}>
                <HiOutlinePrinter /> In Đơn Thuốc (A5/A4)
              </PrimaryBtn>
            </div>

            {/* Mẫu đơn thuốc chuẩn in ấn */}
            <PrescriptionPaper id="printable-prescription">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid #0f172a",
                  paddingBottom: "1.4rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "#1e3a8a",
                      margin: 0,
                    }}
                  >
                    NHA KHOA HI-DENT DENTAL CLINIC
                  </h3>
                  <p style={{ margin: "0.4rem 0 0 0", fontSize: "1.2rem", color: "#64748b" }}>
                    Địa chỉ: 123 Đường Sức Khỏe, Quận 1, TP. Hồ Chí Minh
                  </p>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "1.2rem", color: "#64748b" }}>
                    Hotline: 1900 8888 | Website: www.dentist-clinic.vn
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h2
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 800,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    ĐƠN THUỐC
                  </h2>
                  <p style={{ margin: "0.4rem 0 0 0", fontSize: "1.2rem", color: "#64748b" }}>
                    Ngày: {new Date().toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Thông tin bệnh nhân */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  gap: "1rem",
                  fontSize: "1.35rem",
                }}
              >
                <div>
                  <strong>Họ tên:</strong> {patient.name}
                </div>
                <div>
                  <strong>Tuổi/Năm sinh:</strong> {patient.yearOfBirth}
                </div>
                <div>
                  <strong>Giới tính:</strong>{" "}
                  {patient.gender === true ? "Nam" : "Nữ"}
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <strong>Địa chỉ:</strong> {patient.address}
                </div>
                <div>
                  <strong>SĐT:</strong> {patient.phoneNumber}
                </div>
                <div style={{ gridColumn: "span 3" }}>
                  <strong>Chẩn đoán:</strong>{" "}
                  {sessions[0]?.diagnosis || "Viêm quanh cuống răng / Phục hình răng"}
                </div>
                {allergies.length > 0 && (
                  <div style={{ gridColumn: "span 3", color: "#dc2626" }}>
                    <strong>Cảnh báo dị ứng:</strong> {allergies.join(", ")}
                  </div>
                )}
              </div>

              {/* Danh sách thuốc */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "1rem",
                  fontSize: "1.35rem",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1.5px solid #0f172a" }}>
                    <th style={{ textAlign: "left", padding: "0.8rem 0" }}>STT</th>
                    <th style={{ textAlign: "left", padding: "0.8rem 0" }}>Tên thuốc & Hàm lượng</th>
                    <th style={{ textAlign: "center", padding: "0.8rem 0" }}>Số lượng</th>
                    <th style={{ textAlign: "left", padding: "0.8rem 0" }}>Cách dùng / Lời dặn</th>
                  </tr>
                </thead>
                <tbody>
                  {(sessions[0]?.prescription?.length
                    ? sessions[0].prescription
                    : prescriptions
                  ).map((rx, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "0.8rem 0" }}>{rIdx + 1}</td>
                      <td style={{ padding: "0.8rem 0", fontWeight: 600 }}>
                        {rx.drugName}
                      </td>
                      <td style={{ textAlign: "center", padding: "0.8rem 0" }}>
                        {rx.duration ? `Dùng ${rx.duration}` : "1 Hộp/Vỉ"}
                      </td>
                      <td style={{ padding: "0.8rem 0" }}>
                        Uống {rx.dosage || "1 viên"}, {rx.frequency || "2 lần/ngày"}
                        {rx.instructions ? ` (${rx.instructions})` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Lời dặn chung và chữ ký */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "2rem",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ fontSize: "1.25rem", color: "#475569" }}>
                  <p style={{ margin: "0.3rem 0" }}>
                    * Lời dặn: Uống thuốc đúng liều lượng, sau khi ăn no.
                  </p>
                  <p style={{ margin: "0.3rem 0" }}>
                    * Tái khám ngay nếu có dấu hiệu sưng đau bất thường hoặc sốt.
                  </p>
                  <p style={{ margin: "0.3rem 0" }}>
                    * Khám lại sau: 05 - 07 ngày.
                  </p>
                </div>

                <div style={{ textAlign: "center", minWidth: "180px" }}>
                  <p style={{ margin: 0, fontSize: "1.2rem", color: "#64748b" }}>
                    BÁC SĨ ĐIỀU TRỊ
                  </p>
                  <p style={{ marginTop: "4.5rem", fontWeight: 700, fontSize: "1.35rem" }}>
                    {sessions[0]?.doctor?.name || employees[0]?.name || "BS. Điều trị"}
                  </p>
                </div>
              </div>
            </PrescriptionPaper>
          </div>
        )}
      </TabContentArea>
    </ModalContainer>
  );
}
