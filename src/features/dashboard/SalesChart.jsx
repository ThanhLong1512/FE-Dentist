import { useDarkMode } from "../../hooks/useDarkMode";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";
import { TrendingUp, BarChart3, Calendar, DollarSign } from "lucide-react";
import { formatCurrency } from "../../utils/helpers";

const ChartContainer = styled.div`
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

  /* Grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-200);
    stroke-dasharray: 4 4;
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
      background: rgba(2, 132, 199, 0.1);
      color: var(--color-brand-600);
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

    .period-tag {
      font-size: 1.2rem;
      color: var(--color-grey-400);
      font-weight: 500;
    }
  }
`;

const MetricsSummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetricMiniPill = styled.div`
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1rem 1.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  .pill-icon {
    color: ${(props) => props.$color || "var(--color-brand-600)"};
  }

  .pill-text {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 1.15rem;
      color: var(--color-grey-400);
      font-weight: 500;
    }

    .val {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-grey-800);
    }
  }
`;

const CustomTooltipBox = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 1rem 1.4rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .tooltip-date {
    font-size: 1.15rem;
    color: var(--color-grey-400);
    font-weight: 600;
  }

  .tooltip-sales {
    font-size: 1.45rem;
    font-weight: 700;
    color: var(--color-brand-600);
  }
`;

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipBox>
        <span className="tooltip-date">Ngày {label}</span>
        <span className="tooltip-sales">
          {formatCurrency(payload[0].value)}
        </span>
      </CustomTooltipBox>
    );
  }
  return null;
}

function SalesChart({ orders, numDays }) {
  const { isDarkMode } = useDarkMode();

  const validNumDays = typeof numDays === "number" && numDays > 0 ? numDays : 7;
  let allDates = [];
  try {
    allDates = eachDayOfInterval({
      start: subDays(new Date(), validNumDays - 1),
      end: new Date(),
    });
  } catch (err) {
    console.error("Lỗi khi tính khoảng thời gian biểu đồ:", err);
    allDates = [new Date()];
  }

  const orderList = Array.isArray(orders?.orders) ? orders.orders : [];

  const data = allDates.map((date) => {
    const dayOrders = orderList.filter((order) => {
      if (!order?.createdAt) return false;
      try {
        const orderDate = new Date(order.createdAt);
        return isSameDay(date, orderDate);
      } catch {
        return false;
      }
    });

    const totalSales = dayOrders.reduce(
      (acc, cur) => acc + (Number(cur?.totalPrice) || 0),
      0
    );

    let label = "";
    let fullDate = "";
    try {
      label = format(date, "dd/MM");
      fullDate = format(date, "dd/MM/yyyy");
    } catch {
      label = "N/A";
      fullDate = "N/A";
    }

    return {
      label,
      fullDate,
      totalSales,
    };
  });

  const totalSalesPeriod = data.reduce((acc, cur) => acc + (cur.totalSales || 0), 0);
  const avgSalesPerDay = Math.round(totalSalesPeriod / (data.length || 1));
  const peakSales = data.length > 0 ? Math.max(...data.map((d) => d.totalSales), 0) : 0;

  const startDateText =
    allDates.length > 0 ? format(allDates[0], "dd/MM/yyyy") : "";
  const endDateText =
    allDates.length > 0
      ? format(allDates[allDates.length - 1], "dd/MM/yyyy")
      : "";

  const colors = isDarkMode
    ? {
        stroke: "#38bdf8",
        fillStart: "rgba(56, 189, 248, 0.45)",
        fillEnd: "rgba(56, 189, 248, 0.0)",
        text: "#9ca3af",
      }
    : {
        stroke: "#0284c7",
        fillStart: "rgba(2, 132, 199, 0.35)",
        fillEnd: "rgba(2, 132, 199, 0.0)",
        text: "#6b7280",
      };

  return (
    <ChartContainer>
      <HeaderRow>
        <div className="title-group">
          <div className="icon-box">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3>Biểu Đồ Doanh Thu Phòng Khám</h3>
            <span className="period-tag">
              {startDateText && endDateText
                ? `Từ ${startDateText} đến ${endDateText}`
                : "Khoảng thời gian gần nhất"}
            </span>
          </div>
        </div>
      </HeaderRow>

      <MetricsSummaryRow>
        <MetricMiniPill $color="#10b981">
          <DollarSign size={20} className="pill-icon" />
          <div className="pill-text">
            <span className="label">Tổng doanh thu kỳ</span>
            <span className="val">{formatCurrency(totalSalesPeriod)}</span>
          </div>
        </MetricMiniPill>

        <MetricMiniPill $color="#0284c7">
          <BarChart3 size={20} className="pill-icon" />
          <div className="pill-text">
            <span className="label">Trung bình mỗi ngày</span>
            <span className="val">{formatCurrency(avgSalesPerDay)}</span>
          </div>
        </MetricMiniPill>

        <MetricMiniPill $color="#f59e0b">
          <TrendingUp size={20} className="pill-icon" />
          <div className="pill-text">
            <span className="label">Đỉnh doanh thu ngày</span>
            <span className="val">{formatCurrency(peakSales)}</span>
          </div>
        </MetricMiniPill>
      </MetricsSummaryRow>

      <ResponsiveContainer width="100%" height={290}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colors.fillStart}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={colors.fillEnd}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-grey-200)" }}
          />
          <YAxis
            tick={{ fill: colors.text, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              new Intl.NumberFormat("vi-VN", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <CartesianGrid vertical={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="totalSales"
            stroke={colors.stroke}
            strokeWidth={3}
            fill="url(#salesGradient)"
            name="Doanh thu"
            dot={{ r: 3, fill: colors.stroke }}
            activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default SalesChart;
