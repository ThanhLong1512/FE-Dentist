import styled from "styled-components";
import Heading from "../../components/admin/Heading";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";

const ChartBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

const colorPalette = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#a855f7",
  "#f472b6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
];

const darkColorPalette = [
  "#b91c1c",
  "#c2410c",
  "#a16207",
  "#4d7c0f",
  "#15803d",
  "#0f766e",
  "#1d4ed8",
  "#7e22ce",
  "#be185d",
  "#4f46e5",
  "#7c3aed",
  "#be185d",
];

function prepareServiceData(orders, isDarkMode) {
  const colors = isDarkMode ? darkColorPalette : colorPalette;

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return [];
  }

  const serviceCount = {};

  orders.forEach((order) => {
    if (order.service && Array.isArray(order.service)) {
      order.service.forEach((service) => {
        const serviceName = service.nameService || "Unknown Service";
        serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
      });
    }
  });

  const data = Object.entries(serviceCount).map(
    ([serviceName, count], index) => ({
      name: serviceName,
      value: count,
      color: colors[index % colors.length],
    })
  );

  return data;
}

function preparePaymentMethodData(orders, isDarkMode) {
  const colors = isDarkMode ? darkColorPalette : colorPalette;

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return [];
  }

  const paymentCount = {};

  orders.forEach((order) => {
    const method = order.paymentMethod || "Unknown";
    paymentCount[method] = (paymentCount[method] || 0) + 1;
  });

  const data = Object.entries(paymentCount).map(([method, count], index) => ({
    name: method,
    value: count,
    color: colors[index % colors.length],
  }));

  return data;
}

function ServiceChart({ confirmedOrder, chartType = "services" }) {
  const { isDarkMode } = useDarkMode();

  const orders = confirmedOrder?.orders || [];

  let data = [];
  let chartTitle = "";

  if (chartType === "services") {
    data = prepareServiceData(orders, isDarkMode);
    chartTitle = "Service Distribution";
  } else if (chartType === "payments") {
    data = preparePaymentMethodData(orders, isDarkMode);
    chartTitle = "Payment Methods";
  }

  if (data.length === 0) {
    return (
      <ChartBox>
        <Heading as="h2">{chartTitle}</Heading>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "240px",
            color: "var(--color-grey-400)",
          }}
        >
          No data available
        </div>
      </ChartBox>
    );
  }

  return (
    <ChartBox>
      <Heading as="h2">{chartTitle}</Heading>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            nameKey="name"
            dataKey="value"
            innerRadius={85}
            outerRadius={110}
            cx="40%"
            cy="50%"
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell fill={entry.color} stroke={entry.color} key={entry.name} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} orders`, name]} />
          <Legend
            verticalAlign="middle"
            align="right"
            width="30%"
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default ServiceChart;
