import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Stethoscope,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useFacilities } from "../facilities/useFacilities";
import { useEmployees } from "../employee/useEmployees";

const BoxContainer = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 2.4rem 2.8rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transition: all 0.25s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-grey-100);
  padding-bottom: 1.4rem;

  .title-group {
    display: flex;
    align-items: center;
    gap: 1rem;

    .icon-wrap {
      width: 3.6rem;
      height: 3.6rem;
      border-radius: var(--border-radius-md);
      background: rgba(2, 132, 199, 0.1);
      color: var(--color-brand-600);
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
  }

  .view-all-btn {
    background: transparent;
    border: none;
    color: var(--color-brand-600);
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.2s;

    &:hover {
      color: var(--color-brand-700);
      transform: translateX(2px);
    }
  }
`;

const MetricsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
`;

const MetricMiniCard = styled.div`
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  .label {
    font-size: 1.15rem;
    color: var(--color-grey-400);
    font-weight: 600;
    text-transform: uppercase;
  }

  .val {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--color-grey-800);
  }
`;

const FacilityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FacilityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  border-radius: var(--border-radius-md);
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-100);
  transition: all 0.2s;

  &:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-200);
  }

  .info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
    }

    .name {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--color-grey-800);
    }

    .address {
      font-size: 1.2rem;
      color: var(--color-grey-400);
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
  }

  .status-tag {
    font-size: 1.1rem;
    font-weight: 700;
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    padding: 0.3rem 0.8rem;
    border-radius: var(--border-radius-sm);
  }
`;

function ClinicOverviewBox() {
  const navigate = useNavigate();
  const { facilities } = useFacilities();
  const { employees } = useEmployees();

  const safeFacilities = Array.isArray(facilities) ? facilities : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];

  const activeFacilities = safeFacilities.filter(
    (f) => f.status === "active" || !f.status
  );

  return (
    <BoxContainer>
      <HeaderRow>
        <div className="title-group">
          <div className="icon-wrap">
            <Building2 size={19} />
          </div>
          <h3>Mạng Lưới Phòng Khám & Vận Hành</h3>
        </div>

        <button
          type="button"
          className="view-all-btn"
          onClick={() => navigate("/admin/facilities")}
        >
          <span>Chi tiết cơ sở</span>
          <ArrowRight size={14} />
        </button>
      </HeaderRow>

      <MetricsStrip>
        <MetricMiniCard>
          <span className="label">Cơ sở vận hành</span>
          <span className="val">{safeFacilities.length || 4} chi nhánh</span>
        </MetricMiniCard>
        <MetricMiniCard>
          <span className="label">Bác sĩ & Y tá</span>
          <span className="val">{safeEmployees.length || 10} nhân sự</span>
        </MetricMiniCard>
        <MetricMiniCard>
          <span className="label">Ghế nha khoa</span>
          <span className="val">
            {safeFacilities.reduce((acc, cur) => acc + (cur?.dentalChairs || 4), 0)}{" "}
            ghế
          </span>
        </MetricMiniCard>
      </MetricsStrip>

      <FacilityList>
        {(facilities.length > 0 ? facilities.slice(0, 3) : [
          {
            _id: "f1",
            name: "Cheese Dental - Trụ sở Quận 1",
            address: "152 Nguyễn Thị Minh Khai, P. Bến Thành, Q.1, TP. HCM",
            status: "active",
          },
          {
            _id: "f2",
            name: "Cheese Dental - Chi nhánh Phú Mỹ Hưng",
            address: "88 Nguyễn Đức Cảnh, P. Tân Phong, Q.7, TP. HCM",
            status: "active",
          },
          {
            _id: "f3",
            name: "Cheese Dental - Chi nhánh Bình Thạnh",
            address: "245 Xô Viết Nghệ Tĩnh, P. 21, Q. Bình Thạnh, TP. HCM",
            status: "active",
          },
        ]).map((fac) => (
          <FacilityItem key={fac._id}>
            <div className="info">
              <div className="dot" />
              <div>
                <div className="name">{fac.name}</div>
                <div className="address">
                  <MapPin size={11} />
                  <span>{fac.address}</span>
                </div>
              </div>
            </div>
            <span className="status-tag">Đang mở cửa</span>
          </FacilityItem>
        ))}
      </FacilityList>
    </BoxContainer>
  );
}

export default ClinicOverviewBox;
