import { useDarkMode } from "../../context/DarkModeContext";
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
import Heading from "../../components/admin/Heading";
import DashboardBox from "./DashboardBox";
import { formatCurrency } from "../../utils/helpers";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function SalesChart({ orders, numDays }) {
  const { isDarkMode } = useDarkMode();

  if (!orders || !orders.orders || !Array.isArray(orders.orders)) {
    return (
      <StyledSalesChart>
        <Heading as="h2">Sales Chart</Heading>
        <div style={{ padding: "20px", textAlign: "center" }}>
          No sales data available
        </div>
      </StyledSalesChart>
    );
  }

  const validNumDays = numDays && numDays > 0 ? numDays : 7;
  const allDates = eachDayOfInterval({
    start: subDays(new Date(), validNumDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    const dayOrders = orders.orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return isSameDay(date, orderDate);
    });

    const totalSales = dayOrders.reduce((acc, cur) => acc + cur.totalPrice, 0);

    return {
      label: format(date, "MMM dd"),
      totalSales: totalSales,
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        {" "}
        Sales from {format(allDates.at(0), "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1), "MMM dd yyyy")}{" "}
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            tick={{ fill: colors.text }}
            tickFormatter={(value) =>
              new Intl.NumberFormat("vi-VN", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip
            contentStyle={{ backgroundColor: colors.background }}
            formatter={(value, name) => [formatCurrency(value), name]}
          />
          <Area
            type="monotone"
            dataKey="totalSales"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total sales"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
