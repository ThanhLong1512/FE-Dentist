import { useState } from "react";
import styled from "styled-components";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useDarkMode } from "../../hooks/useDarkMode";
import { PieChart as PieIcon, CreditCard, Stethoscope } from "lucide-react";

const ChartBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 2.4rem 2.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  transition: all 0.25s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .title-group {
    display: flex;
    align-items: center;
    gap: 1rem;

    .icon-box {
      width: 3.8rem;
      height: 3.8rem;
      border-radius: var(--border-radius-md);
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h3 {
      font-size: 1.65rem;
      font-weight: 700;
      color: var(--color-grey-800);
      margin: 0;
    }
  }
`;

const TabButtonGroup = styled.div`
  display: flex;
  background: var(--color-grey-100);
  padding: 0.3rem;
  border-radius: var(--border-radius-sm);
  gap: 0.3rem;
`;

const TabButton = styled.button`
  border: none;
  background: ${(props) => (props.$active ? "var(--color-grey-0)" : "transparent")};
  color: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-500)"};
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${(props) => (props.$active ? "var(--shadow-sm)" : "none")};
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    color: var(--color-brand-600);
  }
`;

const ChartContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 48%;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 0.4rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-200);
    border-radius: 4px;
  }

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  font-size: 1.25rem;

  .left {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    min-width: 0;

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: ${(props) => props.$color};
      flex-shrink: 0;
    }

    .name {
      color: var(--color-grey-700);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-shrink: 0;

    .val {
      font-weight: 700;
      color: var(--color-grey-800);
    }

    .pct {
      color: var(--color-grey-400);
      font-size: 1.15rem;
    }
  }
`;

const PALETTE = [
  "#0284c7",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#6366f1",
  "#14b8a6",
  "#f97316",
];

const PAYMENT_LABELS = {
  vnpay: "VNPAY Online",
  cash: "Tiền mặt tại quầy",
  cod: "Tiền mặt tại quầy",
  card: "Thẻ ngân hàng / POS",
  transfer: "Chuyển khoản trực tiếp",
};

function prepareServiceData(orders) {
  if (!orders || !Array.isArray(orders) || orders.length === 0) return [];

  const map = {};
  orders.forEach((o) => {
    if (o.service && Array.isArray(o.service)) {
      o.service.forEach((s) => {
        const name = s.nameService || "Dịch vụ nha khoa";
        map[name] = (map[name] || 0) + 1;
      });
    }
  });

  return Object.entries(map).map(([name, count], idx) => ({
    name,
    value: count,
    color: PALETTE[idx % PALETTE.length],
  }));
}

function preparePaymentData(orders) {
  if (!orders || !Array.isArray(orders) || orders.length === 0) return [];

  const map = {};
  orders.forEach((o) => {
    const key = (o.paymentMethod || "cash").toLowerCase();
    const label = PAYMENT_LABELS[key] || o.paymentMethod || "Khác";
    map[label] = (map[label] || 0) + 1;
  });

  return Object.entries(map).map(([name, count], idx) => ({
    name,
    value: count,
    color: PALETTE[idx % PALETTE.length],
  }));
}

function ServiceChart({ confirmedOrder }) {
  const [activeTab, setActiveTab] = useState("services"); // "services" | "payments"
  const orders = confirmedOrder?.orders || [];

  const data =
    activeTab === "services"
      ? prepareServiceData(orders)
      : preparePaymentData(orders);

  const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);

  // Fallback demo data if db has 0 orders
  const displayData =
    data.length > 0
      ? data
      : activeTab === "services"
      ? [
          { name: "Khám tổng quát & Lấy cao", value: 6, color: PALETTE[0] },
          { name: "Tẩy trắng răng Laser", value: 4, color: PALETTE[1] },
          { name: "Trám răng thẩm mỹ", value: 3, color: PALETTE[2] },
          { name: "Chỉnh nha niềng răng", value: 2, color: PALETTE[3] },
        ]
      : [
          { name: "VNPAY Online", value: 8, color: PALETTE[0] },
          { name: "Tiền mặt tại quầy", value: 5, color: PALETTE[1] },
          { name: "Thẻ ngân hàng", value: 2, color: PALETTE[2] },
        ];

  const displayTotal = displayData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <ChartBox>
      <HeaderRow>
        <div className="title-group">
          <div className="icon-box">
            <PieIcon size={20} />
          </div>
          <h3>Phân Bổ Vận Hành</h3>
        </div>

        <TabButtonGroup>
          <TabButton
            type="button"
            $active={activeTab === "services"}
            onClick={() => setActiveTab("services")}
          >
            <Stethoscope size={13} />
            <span>Dịch vụ</span>
          </TabButton>
          <TabButton
            type="button"
            $active={activeTab === "payments"}
            onClick={() => setActiveTab("payments")}
          >
            <CreditCard size={13} />
            <span>Thanh toán</span>
          </TabButton>
        </TabButtonGroup>
      </HeaderRow>

      <ChartContent>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "240px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={displayData}
                nameKey="name"
                dataKey="value"
                innerRadius={65}
                outerRadius={95}
                cx="50%"
                cy="50%"
                paddingAngle={4}
              >
                {displayData.map((entry) => (
                  <Cell
                    fill={entry.color}
                    stroke="var(--color-grey-0)"
                    strokeWidth={2}
                    key={entry.name}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [`${val} lượt`, name]}
                contentStyle={{
                  backgroundColor: "var(--color-grey-0)",
                  borderColor: "var(--color-grey-200)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: "800",
                color: "var(--color-grey-800)",
              }}
            >
              {displayTotal}
            </span>
            <span
              style={{
                fontSize: "1.1rem",
                color: "var(--color-grey-400)",
                fontWeight: "600",
              }}
            >
              {activeTab === "services" ? "lượt khám" : "giao dịch"}
            </span>
          </div>
        </div>

        <LegendList>
          {displayData.map((item) => {
            const pct = Math.round((item.value / displayTotal) * 100);
            return (
              <LegendItem key={item.name} $color={item.color}>
                <div className="left">
                  <div className="dot" />
                  <span className="name" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <div className="right">
                  <span className="val">{item.value}</span>
                  <span className="pct">({pct}%)</span>
                </div>
              </LegendItem>
            );
          })}
        </LegendList>
      </ChartContent>
    </ChartBox>
  );
}

export default ServiceChart;
